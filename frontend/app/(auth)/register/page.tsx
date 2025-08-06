'use client';

import React, { useState, useRef } from "react";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError({});
    setError(null);
    setSuccess(false);
    // Simple validation
    if (!name) {
      setFieldError({ name: "Ime je obavezno." });
      nameRef.current?.focus();
      return;
    }
    if (!email) {
      setFieldError({ email: "Email je obavezan." });
      emailRef.current?.focus();
      return;
    }
    if (!password) {
      setFieldError({ password: "Lozinka je obavezna." });
      passwordRef.current?.focus();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3002/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error("Registracija nije uspjela");
      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8"
    >
      <h2 className="text-xl font-bold mb-4">Registracija</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && (
        <div className="text-green-600 mb-2">Uspješna registracija!</div>
      )}
      <input
        ref={nameRef}
        type="text"
        placeholder="Ime i prezime"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`w-full mb-1 p-2 border rounded ${fieldError.name ? "border-red-500" : ""}`}
        required
      />
      {fieldError.name && (
        <div className="text-red-500 mb-2 text-sm">{fieldError.name}</div>
      )}
      <input
        ref={emailRef}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`w-full mb-1 p-2 border rounded ${fieldError.email ? "border-red-500" : ""}`}
        required
      />
      {fieldError.email && (
        <div className="text-red-500 mb-2 text-sm">{fieldError.email}</div>
      )}
      <input
        ref={passwordRef}
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`w-full mb-1 p-2 border rounded ${fieldError.password ? "border-red-500" : ""}`}
        required
      />
      {fieldError.password && (
        <div className="text-red-500 mb-2 text-sm">{fieldError.password}</div>
      )}
      <button
        type="submit"
        className="w-full bg-pink-600 text-white py-2 rounded font-bold mt-2"
        disabled={loading}
      >
        {loading ? "Registracija..." : "Registriraj se"}
      </button>
    </form>
  );
};

export default RegisterPage;
