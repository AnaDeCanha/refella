"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use for redirection
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = () => {
  const router = useRouter(); // Use router for navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Redirect to ChatBox after successful login/signup
      router.push("/chat"); // Navigate to /chat
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-lightLila rounded-2xl shadow-md p-6 w-full max-w-[500px] mx-auto mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-lg border mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 rounded-lg border mb-3"
        />
        <button type="submit" className="bg-lila text-light p-3 rounded-lg">
          {isSignUp ? "Sign Up" : "Login"}
        </button>
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4">
        {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
      </button>
    </div>
  );
};

export default AuthForm;
