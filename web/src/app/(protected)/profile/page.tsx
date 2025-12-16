"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Formik, Form, Field } from "formik";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <main>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

        {/* Profile Picture */}
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={
              user.profilePicture ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgsaRe2zqH_BBicvUorUseeTaE4kxPL2FmOQ&s"
            }
            width={80}
            height={80}
            className="rounded-full object-cover"
            alt="Profile"
          />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-6 text-sm">
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Referral Code:</strong> {user.referralCode}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString("id-ID")}
          </p>
        </div>

        {/* FORM */}
        <Formik
          initialValues={{
            name: user.name ?? "",
            bio: user.bio ?? "",
          }}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await axios.put(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/user/profile`,
                values,
                { withCredentials: true }
              );

              await refreshUser();
              alert("Profile updated");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Name */}
              <label className="block mb-2 font-medium">Name</label>
              <Field name="name" className="w-full border p-2 mb-4 rounded" />

              {/* Bio */}
              <label className="block mb-2 font-medium">Bio</label>
              <Field
                as="textarea"
                name="bio"
                className="w-full border p-2 mb-4 rounded"
              />

              {/* Point & Coupon */}
              <div className="mt-4 space-y-1 text-sm">
                <p>
                  <strong>Points:</strong> {user.pointBalance}
                </p>

                <p>
                  <strong>Coupon:</strong>{" "}
                  {user.coupon ? (
                    <>
                      <span className="font-mono px-2 py-1 rounded">
                        {user.coupon.code}
                      </span>
                      ({user.coupon.discount.toLocaleString("id-ID")})
                    </>
                  ) : (
                    "No active coupon"
                  )}
                </p>

                {user.coupon && (
                  <p className="text-gray-500">
                    Expires:{" "}
                    {new Date(user.coupon.expiredAt).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:scale-110 duration-300"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/change-password")}
                  className="border px-4 py-2 rounded cursor-pointer hover:scale-110 duration-300"
                >
                  Change Password
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
