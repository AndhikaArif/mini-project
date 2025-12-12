"use client";

import { useTheme } from "@/context/theme-context";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout, userImage } = useAuth();

  return (
    <nav
      className={`flex justify-between p-4 w-full shadow-md transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="text-lg font-semibold">
        Event Manager
      </Link>

      {/* Dekstop Navigation */}
      <div className="hidden sm:flex gap-12 mr-12">
        <Link
          href="/"
          className="transition-colors duration-300 hover:text-blue-400"
        >
          Home
        </Link>
        <Link
          href="./about"
          className="transition-colors duration-300 hover:text-blue-400"
        >
          About
        </Link>
        <Link
          href="./events"
          className="transition-colors duration-300 hover:text-blue-400"
        >
          Events
        </Link>
        <Link
          href="./contact"
          className="transition-colors duration-300 hover:text-blue-400"
        >
          Contact Me
        </Link>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-4">
        {/* Toggle Theme */}
        <button
          onClick={toggleTheme}
          className="text-2xl hover:scale-125 transition-transform duration-150 cursor-pointer"
        >
          {isDark ? "🌞" : "🌙"}
        </button>

        {/* Login/Register */}
        <div className="flex gap-4 items-center">
          {loading ? (
            <div className="opacity-50 text-sm">...</div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9">
                <Image
                  src={userImage}
                  className="rounded-full border object-cover"
                  fill
                  alt="Photo Profile"
                />
              </div>

              <button
                onClick={logout}
                className="text-red-400 hover:underline cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
        {/* Hamburger (mobile only) */}
        <button
          className="text-3xl sm:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Mobile dropdown menu */}
        {isOpen && (
          <div
            className={`absolute top-16 left-0 pl-4 pt-3 w-full sm:hidden flex flex-col gap-4 shadow-lg transition duration-300 ${
              isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
            }`}
          >
            <Link
              href={`/`}
              className="duration-300 hover:text-blue-400"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href={`/about`}
              className="duration-300 hover:text-blue-400"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href={`/events`}
              className="duration-300 hover:text-blue-400"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link
              href={`/contact`}
              className="duration-300 hover:text-blue-400"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
