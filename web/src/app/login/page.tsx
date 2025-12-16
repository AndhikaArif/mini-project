"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useThemeClass, useThemeButton } from "@/components/theme";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { loginSchemaFront } from "@/validation/login.validation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const themeButton = useThemeButton();
  const themeClass = useThemeClass();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  return (
    <main>
      <div className="max-w-md mx-auto p-6 border rounded-xl mt-10">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={toFormikValidationSchema(loginSchemaFront)}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/login`,
                values,
                { withCredentials: true }
              );

              alert("Login Success");
              await refreshUser();
              router.replace("/");
              return;
            } catch (err: unknown) {
              if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.message;

                if (msg === "Username or password is wrong") {
                  setErrors({ username: msg, password: msg });
                } else {
                  console.error("Unexpected error:", err);
                }
              }

              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => {
            return (
              <Form className="flex flex-col gap-4">
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
                <div className="flex flex-col gap-1">
                  <label className="font-medium">Password</label>

                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`border p-2 rounded w-full ${themeClass}`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm cursor-pointer"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

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
