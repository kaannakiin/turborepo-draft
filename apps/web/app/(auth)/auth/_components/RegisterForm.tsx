"use client";
import {
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { FacebookButton } from "../../../../components/FacebookButton";
import { GoogleButton } from "../../../../components/GoogleButton";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { RegisterSchema, RegisterSchemaType } from "@repo/shared-types";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomPhoneInput from "../../../../components/CustomPhoneInput";
import Link from "next/link";

const RegisterForm = () => {
  const { control, handleSubmit } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit: SubmitHandler<RegisterSchemaType> = async (
    data: RegisterSchemaType
  ) => {};

  return (
    <Paper
      radius={"lg"}
      p={"lg"}
      withBorder
      bg={"gray.1"}
      w={{ base: "100%", xs: 250, sm: 300, md: 400 }}
      maw={500}
      mx="auto"
    >
      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <FacebookButton radius={"xl"}>Facebook</FacebookButton>
      </Group>
      <Divider label="Kayıt Ol" labelPosition="center" c={"white"} my="lg" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={"sm"}>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  error={fieldState.error?.message}
                  label="İsim"
                />
              )}
            />
            <Controller
              control={control}
              name="surname"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  error={fieldState.error?.message}
                  label="Soyisim"
                />
              )}
            />
          </SimpleGrid>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                error={fieldState.error?.message}
                value={field.value || ""}
                label="E-posta"
                type="email"
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <CustomPhoneInput
                label="Telefon Numarası"
                onChange={field.onChange}
                value={field.value || ""}
                error={fieldState.error?.message}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                error={fieldState.error?.message}
                label="Şifre"
                type="password"
              />
            )}
          />
          <Controller
            control={control}
            name="checkPassword"
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                error={fieldState.error?.message}
                label="Şifre Tekrarı"
              />
            )}
          />
          <Group justify="space-between" align="center">
            <Link href={"/auth/login"} className="flex items-center gap-1">
              <Text fz={"sm"}>Zaten bir hesabın var mı?</Text>
              <Text fz={"sm"} fw={700}>
                Giriş yap
              </Text>
            </Link>
            <Button radius="lg" type="submit">
              Kayıt Ol
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default RegisterForm;
