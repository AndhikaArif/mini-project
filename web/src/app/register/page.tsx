"use client";

import { useTheme } from "@/context/theme-context";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useThemeClass } from "@/components/theme";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { registerSchemaFront } from "@/validation/register.validation";

export default function RegisterPage() {
  const { isDark } = useTheme();
  const themeClass = useThemeClass();

  return (
    <main>
      <div className="max-w-md mx-auto p-6 border rounded-xl mt-10">
        <h2 className="text-xl font-semibold mb-4">Register</h2>

        <Formik
          initialValues={{ name: "", username: "", email: "", password: "" }}
          validationSchema={toFormikValidationSchema(registerSchemaFront)}
          onSubmit={async (values, { setErrors }) => {
            const res = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });

            const data = await res.json();

            // cek database apakah username/email sudah digunakan
            if (!res.ok && data.field) {
              setErrors({ [data.field]: data.message });
              return;
            }

            alert("Register Success!");
          }}
        >
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
            <div className="flex flex-col gap-1">
              <label className="font-medium">Password</label>

              <Field
                name="password"
                type="password"
                placeholder="Password"
                className={`border p-2 rounded ${themeClass}`}
              />

              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              className={`p-2 rounded hover:scale-110 duration-500 transition cursor-pointer ${
                isDark ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              Register
            </button>
          </Form>
        </Formik>
      </div>
    </main>
  );
}
