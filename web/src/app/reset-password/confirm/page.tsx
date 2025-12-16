"use client";

import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { resetPasswordConfirmSchema } from "@/validation/reset-password.validation";

export default function ResetPasswordConfirmPage() {
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
            <div>
              <label>New Password</label>
              <Field
                type="password"
                name="newPassword"
                className="w-full border p-2 rounded"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <Field
                type="password"
                name="confirmPassword"
                className="w-full border p-2 rounded"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white p-2 rounded hover:scale-105"
            >
              {isSubmitting ? "Processing..." : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}
