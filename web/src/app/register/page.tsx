"use client";

import { useTheme } from "@/context/theme-context";
import { Formik, Form, Field } from "formik";
import { useThemeClass } from "@/components/theme";

export default function RegisterPage() {
  const { isDark } = useTheme();
  const themeClass = useThemeClass();

  return (
    <main>
      <div className="max-w-md mx-auto p-6 border rounded-xl mt-10">
        <h2 className="text-xl font-semibold mb-4">Register</h2>

        <Formik
          initialValues={{ name: "", username: "", email: "", password: "" }}
          onSubmit={async (values) => {
            const res = await fetch("/api/auth/register", {
              method: "POST",
              body: JSON.stringify(values),
            });

            const data = await res.json();
            console.log(data);
          }}
        >
          <Form className="flex flex-col gap-4">
            <Field
              name="name"
              placeholder="Name"
              className={`border p-2 rounded ${themeClass}`}
            />

            <Field
              name="username"
              placeholder="Username"
              className={`border p-2 rounded ${themeClass}`}
            />

            <Field
              name="email"
              placeholder="Email"
              className={`border p-2 rounded ${themeClass}`}
            />

            <Field
              name="password"
              placeholder="Password"
              className={`border p-2 rounded ${themeClass}`}
            />

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
