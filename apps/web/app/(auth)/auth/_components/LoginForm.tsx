"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { LoginSchema, LoginSchemaType } from "@repo/shared-types";
import { IconMail, IconPhone } from "@tabler/icons-react";
import Link from "next/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CustomPhoneInput from "../../../../components/CustomPhoneInput";
import { FacebookButton } from "../../../../components/FacebookButton";
import { GoogleButton } from "../../../../components/GoogleButton";

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    reset,
    watch,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      type: "email",
      email: "",
      password: "",
    },
  });

  const type = watch("type") || "email";
  const onSubmit: SubmitHandler<LoginSchemaType> = async (
    data: LoginSchemaType
  ) => {};

  return (
    <Paper
      radius={"lg"}
      p={"lg"}
      withBorder
      bg={"gray.1"}
      w={{ base: "100%", xs: 250, sm: 300, md: 400 }}
      maw={400}
      mx="auto"
    >
      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <FacebookButton radius={"xl"}>Facebook</FacebookButton>
      </Group>
      <Divider
        label={`${type === "email" ? "E-posta ile giriş yapın" : "Telefon ile giriş yapın"}`}
        labelPosition="center"
        c={"white"}
        my="lg"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={"sm"}>
          {type === "email" ? (
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  error={fieldState.error?.message}
                  type="email"
                  label="E-posta"
                />
              )}
            />
          ) : (
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState: { error } }) => (
                <CustomPhoneInput
                  label="Telefon Numarası"
                  onChange={field.onChange}
                  value={field.value}
                  error={error?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
          )}
          <Button
            fullWidth
            variant="outline"
            justify="center"
            onClick={() => {
              if (type === "email") {
                reset({
                  type: "phone",
                  password: "",
                  phone: "",
                });
              } else {
                reset({
                  type: "email",
                  password: "",
                  email: "",
                });
              }
            }}
            leftSection={type === "email" ? <IconPhone /> : <IconMail />}
          >
            {type === "email"
              ? "Telefon ile giriş yap"
              : "E-posta ile giriş yap"}
          </Button>
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                label="Şifre"
                error={fieldState.error?.message}
              />
            )}
          />
          <Group justify="space-between" align="center">
            <Link
              href={"/auth/register"}
              className="flex flex-row items-center gap-1"
            >
              <Text fz={"sm"}>Bir hesabınız yok mu? </Text>
              <Text fz={"sm"} fw={700}>
                Üye Ol{" "}
              </Text>
            </Link>
            <Button type="submit" radius={"lg"}>
              Giriş Yap
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default LoginForm;
