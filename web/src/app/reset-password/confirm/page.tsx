"use client";

import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { resetPasswordConfirmSchema } from "@/validation/reset-password.validation";
import { useThemeButton, useThemeClass } from "@/components/theme";
import PasswordField from "@/components/form/passwordField";

export default function ResetPasswordConfirmPage() {
  const themeButton = useThemeButton();
  const themeClass = useThemeClass();
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  if (!token) {
    return <p className="text-center mt-10">Invalid reset link</p>;
  }

  return (
    <main className="max-w-md mx-auto p-6 mt-10 border rounded-xl">
      <h1 className="text-xl font-semibold mb-4">Reset Password</h1>

      <Formik
        initialValues={{
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={toFormikValidationSchema(resetPasswordConfirmSchema)}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/reset-password/confirm`,
              {
                token,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
              }
            );

            alert("Password reset successful. Please login again.");
            router.replace("/login");
          } catch (err: unknown) {
            const errorMessage = axios.isAxiosError(err)
              ? err.response?.data?.message
              : "Reset password failed";

            alert(errorMessage);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <PasswordField
              name="newPassword"
              label="New Password"
              placeholder="New Password"
              className={themeClass}
            />

            <PasswordField
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm Password"
              className={themeClass}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-2 rounded hover:scale-110 duration-300 cursor-pointer ${themeButton}`}
            >
              {isSubmitting ? "Processing..." : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}
