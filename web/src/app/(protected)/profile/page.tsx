"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  async function handleSave() {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/user/profile`,
        { name, bio },
        { withCredentials: true }
      );

      await refreshUser();
      alert("Profile updated");
    } finally {
      setLoading(false);
    }
  }

  return (
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
          <p className="text-sm text-gray-500">@{user.username}</p>
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
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Name */}
      <label className="block mb-2 font-medium">Name</label>
      <input
        className="w-full border p-2 mb-4 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Bio */}
      <label className="block mb-2 font-medium">Bio</label>
      <textarea
        className="w-full border p-2 mb-4 rounded"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      {/* Point */}
      <div className="mt-4 space-y-1 text-sm">
        <p>
          <strong>Points:</strong> {user.pointBalance}
        </p>

        {/* Coupon */}
        <p>
          <strong>Coupon:</strong>
          {user.coupon ? (
            <>
              <span className="font-mono  px-2 py-1 rounded">
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
            Expires:
            {new Date(user.coupon.expiredAt).toLocaleDateString("id-ID")}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:scale-110 duration-300"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={() => router.push("/change-password")}
          className="border px-4 py-2 rounded cursor-pointer hover:scale-110 duration-300"
        >
          Change Password
        </button>

        <button
          onClick={() => router.push("/reset-password")}
          className="border px-4 py-2 rounded text-red-600 cursor-pointer hover:scale-110 duration-300"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
