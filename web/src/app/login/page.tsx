"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useThemeClass, useThemeButton } from "@/components/theme";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { loginSchemaFront } from "@/validation/login.validation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import PasswordField from "@/components/form/passwordField";
import { useState } from "react";
import LoadingScreen from "@/components/loading-screen";

export default function LoginPage() {
  const themeButton = useThemeButton();
  const themeClass = useThemeClass();
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [globalError, setGlobalError] = useState<string | null>(null);

  return (
    <main>
      <div className="max-w-md mx-auto p-6 border rounded-xl mt-10">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={toFormikValidationSchema(loginSchemaFront)}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            setGlobalError(null);

            try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/login`,
                values,
                { withCredentials: true }
              );

              await refreshUser();

              router.replace("/");

              return;
            } catch (err: unknown) {
              if (axios.isAxiosError(err)) {
                // Tidak ada response (Supabase / API down)
                if (!err.response) {
                  setGlobalError(
                    "Server sedang bermasalah. Silakan coba login lagi beberapa saat."
                  );
                  return;
                }

                const status = err.response.status;

                //  Username / password salah
                if (status === 401) {
                  setErrors({
                    username: "Username or password is wrong",
                    password: "Username or password is wrong",
                  });
                  return;
                }

                //  Server error (Supabase error biasanya 500)
                if (status >= 500) {
                  setGlobalError(
                    "The service is currently unavailable. Please try again later."
                  );
                  return;
                }
              }

              // fallback
              setGlobalError("An error occurred. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => {
            if (isSubmitting) {
              return <LoadingScreen />;
            }
            return (
              <Form className="flex flex-col gap-4">
                {/* Error Supabase */}
                {globalError && (
                  <div className="bg-red-100 text-red-600 p-2 rounded text-sm mb-3">
                    {globalError}
                  </div>
                )}

                {/* USERNAME */}
                <div className="flex flex-col gap-1">
                  <label className="font-medium">Username</label>

                  <Field
                    name="username"
                    placeholder="Email or Username"
                    className={`border p-2 rounded ${themeClass}`}
                  />

                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* PASSWORD */}
                <PasswordField
                  name="password"
                  label="Password"
                  className={themeClass}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`p-2 rounded transition duration-300 cursor-pointer ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-110"
                  } ${themeButton}`}
                >
                  {isSubmitting ? "Processing..." : "Login"}
                </button>

                <div className="text-sm text-right mt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </main>
  );
}
