"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useThemeClass, useThemeButton } from "@/components/theme";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { registerSchemaFront } from "@/validation/register.validation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AutoSave from "@/components/auto-save";
import PasswordField from "@/components/form/passwordField";
import LoadingScreen from "@/components/loading-screen";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const themeButton = useThemeButton();
  const themeClass = useThemeClass();
  const router = useRouter();

  // Ambil sessionStorage sekali saat mount
  const [savedValues, setSavedValues] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    referralCode: "",
  });

  useEffect(() => {
    async function getSessionData() {
      const stored = sessionStorage.getItem("form");
      if (stored) {
        setSavedValues(JSON.parse(stored));
      }
    }

    getSessionData();
  }, []);

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) return <LoadingScreen />;
  if (user) return null;

  return (
    <main>
      <div className="max-w-md mx-auto p-6 border rounded-xl mt-10">
        <h2 className="text-xl font-semibold mb-4">Register</h2>

        <Formik
          initialValues={savedValues}
          enableReinitialize
          validationSchema={toFormikValidationSchema(registerSchemaFront)}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/register`,
                values,
                {
                  withCredentials: true,
                }
              );

              sessionStorage.removeItem("form");

              router.replace(`/login`);
              return;
            } catch (err: unknown) {
              if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.message;

                if (msg === "User already exist") {
                  setErrors({ email: msg, username: msg });
                }

                if (msg === "Invalid referral code") {
                  setErrors({ referralCode: msg });
                }
              } else {
                console.error("Unexpected error:", err);
              }

              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => {
            if (isSubmitting) {
              return <LoadingScreen />;
            }
            return (
              <>
                <AutoSave />
                <Form className="flex flex-col gap-4">
                  {/* NAME */}
                  <div className="flex flex-col gap-1">
                    <label className="font-medium">Name</label>
                    <Field
                      name="name"
                      placeholder="Name"
                      className={`border p-2 rounded ${themeClass}`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* USERNAME */}
                  <div className="flex flex-col gap-1">
                    <label className="font-medium">Username</label>
                    <Field
                      name="username"
                      placeholder="Username"
                      className={`border p-2 rounded ${themeClass}`}
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="flex flex-col gap-1">
                    <label className="font-medium">Email</label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email"
                      className={`border p-2 rounded ${themeClass}`}
                    />
                    <ErrorMessage
                      name="email"
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

                  {/* REFERRAL */}
                  <div className="flex flex-col gap-1">
                    <label className="font-medium">
                      Referral Code (optional)
                    </label>

                    {/* Bisa pakai Field atau input bebas */}
                    <Field
                      name="referralCode"
                      placeholder="Referral Code"
                      className={`border p-2 rounded ${themeClass}`}
                    />

                    <ErrorMessage
                      name="referralCode"
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
                    {isSubmitting ? "Processing..." : "Register"}
                  </button>
                </Form>
              </>
            );
          }}
        </Formik>
      </div>
    </main>
  );
}
