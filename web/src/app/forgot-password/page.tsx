"use client";

import { useThemeButton } from "@/components/theme";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export default function ForgotPasswordPage() {
  const themeButton = useThemeButton();
  const router = useRouter();

  return (
    <main className="max-w-md mx-auto p-6 mt-10 border rounded-xl">
      <h1 className="text-xl font-semibold mb-4">Forgot Password</h1>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={toFormikValidationSchema(forgotPasswordSchema)}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/reset-password/request`,
              values
            );

            router.push("/login");
          } catch {
            // sengaja dikosongkan agar user tidak tau kalau email itu ada atau tidak di database
          } finally {
            alert("Reset password link has been sent to your email.");
            resetForm();
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Field
                name="email"
                type="email"
                className="w-full border p-2 rounded"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-2 rounded hover:scale-105 duration-300 cursor-pointer ${themeButton}`}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}
