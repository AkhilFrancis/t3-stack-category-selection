'use client'
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

const SignUpForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signUpMutation = api.auth.signup.useMutation();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signUpMutation.mutateAsync({ email, password });
      // Assume the token is returned upon successful signup for auto-login
      if (result.token) {
        Cookies.set('authToken', result.token, { expires: 7, secure: true, sameSite: 'strict' });
        alert('Signup successful');
        router.push(`/auth/verifyotp?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      alert(`Signup failed`);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={signUpMutation.isPending}>Sign Up</button>
    </form>
  );
};

export default SignUpForm;
