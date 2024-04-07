'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from "~/trpc/react";
import Cookies from 'js-cookie';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = api.auth.login.useMutation();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result.token) {
        Cookies.set('authToken', result.token, { expires: 7, secure: true, sameSite: 'strict' });
        router.push('/category');
        alert('Login successful, token set in cookie');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" disabled={loginMutation.isPending}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;
