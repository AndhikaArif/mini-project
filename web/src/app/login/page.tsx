"use client";

import { useTheme } from "@/context/theme-context";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useThemeClass } from "@/components/theme";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export default function LoginPage() {
  const { isDark } = useTheme();
  const themeClass = useThemeClass();

  return (
    <main>
      <div className="max-w-md mx-auto p-6 border rounded-xl mt-10">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={toFormikValidationSchema(loginSchema)}
          onSubmit={async (values) => {
            const res = await fetch("/api/auth.login", {
              method: "POST",
              body: JSON.stringify(values),
            });

            const data = await res.json();
            console.log(data);
          }}
        >
          <Form className="flex flex-col gap-4">
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
              Login
            </button>
          </Form>
        </Formik>
      </div>
    </main>
  );
}
