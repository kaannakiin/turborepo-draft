import * as z from "zod";
import {
  isValidPhoneNumber,
  getCountryCallingCode,
  getCountries,
  isPossiblePhoneNumber,
} from "libphonenumber-js";

/**
 * Telefon numarasının geçerli olup olmadığını kontrol eder
 * @param phone - Kontrol edilecek telefon numarası
 * @returns { isValid: boolean, isEmpty: boolean, error?: string }
 */
export function validatePhoneNumber(phone: string | null | undefined) {
  const phoneValue = phone?.trim();

  // Boş değerleri kontrol et
  if (!phoneValue || phoneValue === "") {
    return { isValid: false, isEmpty: true };
  }

  const allCountryCodes = getCountries().map(
    (country) => `+${getCountryCallingCode(country)}`
  );

  if (allCountryCodes.includes(phoneValue)) {
    return { isValid: false, isEmpty: true };
  }

  // Gerçek telefon numarası validasyonu
  if (isValidPhoneNumber(phoneValue)) {
    return { isValid: true, isEmpty: false };
  } else {
    return {
      isValid: false,
      isEmpty: false,
      error: "Lütfen geçerli bir telefon numarası giriniz",
    };
  }
}

export const RegisterSchema = z
  .object({
    email: z
      .string({ error: "Lütfen geçerli bir email giriniz" })
      .optional()
      .nullable(),
    phone: z
      .string({ error: "Lütfen geçerli bir telefon numarası giriniz" })
      .optional()
      .nullable(),
    name: z
      .string({ error: "Lütfen geçerli bir isim giriniz" })
      .min(2, { error: "İsim en az 2 karakter olmalıdır" })
      .max(50, { error: "İsim en fazla 50 karakter olmalıdır" }),
    surname: z
      .string({ error: "Lütfen geçerli bir soyisim giriniz" })
      .min(2, { error: "Soyisim en az 2 karakter olmalıdır" })
      .max(50, { error: "Soyisim en fazla 50 karakter olmalıdır" }),
    password: z
      .string({ error: "Lütfen geçerli bir şifre giriniz" })
      .min(6, { error: "Şifre en az 6 karakter olmalıdır" })
      .max(50, { error: "Şifre en fazla 50 karakter olmalıdır" }),
    checkPassword: z
      .string({ error: "Lütfen geçerli bir şifre giriniz" })
      .min(6, { error: "Şifre en az 6 karakter olmalıdır" })
      .max(50, { error: "Şifre en fazla 50 karakter olmalıdır" }),
  })
  .check(({ value, issues }) => {
    // Şifre eşleşme kontrolü
    if (value.password !== value.checkPassword) {
      issues.push({
        code: "custom",
        message: "Şifreler eşleşmiyor. Lütfen kontrol ediniz.",
        input: ["checkPassword"],
        path: ["checkPassword"],
      });
    }

    // Telefon numarası kontrolü
    const phoneValidation = validatePhoneNumber(value.phone);
    if (
      !phoneValidation.isEmpty &&
      !phoneValidation.isValid &&
      phoneValidation.error
    ) {
      issues.push({
        code: "custom",
        message: phoneValidation.error,
        path: ["phone"],
        input: ["phone"],
      });
    }

    // Email kontrolü
    const emailValue = value.email?.trim();
    const hasValidEmail = emailValue && emailValue !== "";

    // Email veya telefon en az birinin olması gerekiyor
    if (!hasValidEmail && !phoneValidation.isValid) {
      issues.push({
        code: "custom",
        message: "Email veya telefon numarasından en az biri gereklidir",
        path: ["email"],
        input: ["email"],
      });
    }
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("email"),
    email: z.email({ error: "Lütfen geçerli bir email adresi giriniz." }),
    password: z
      .string({ error: "Lütfen geçerli bir şifre giriniz." })
      .min(6, {
        error: "Şifre en az 6 karakter olmalıdır.",
      })
      .max(50, {
        error: "Şifre en fazla 50 karakter olmalıdır.",
      }),
  }),
  z.object({
    type: z.literal("phone"),
    phone: z
      .string({ error: "Lütfen geçerli bir telefon numarası giriniz." })
      .refine(
        (value) => {
          try {
            const isValidPhone = isPossiblePhoneNumber(value);
            return isValidPhone;
          } catch (error) {
            return false;
          }
        },
        { error: "Lütfen geçerli bir telefon numarası giriniz." }
      ),
    password: z
      .string({ error: "Lütfen geçerli bir şifre giriniz." })
      .min(6, {
        error: "Şifre en az 6 karakter olmalıdır.",
      })
      .max(50, {
        error: "Şifre en fazla 50 karakter olmalıdır.",
      }),
  }),
]);
export type LoginSchemaType = z.infer<typeof LoginSchema>;
