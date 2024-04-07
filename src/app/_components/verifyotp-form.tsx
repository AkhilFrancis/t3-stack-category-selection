'use client'
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '~/trpc/react';

const VerifyOTPForm = () => {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const verifyOtpMutation = api.auth.verifyOtp.useMutation();

  useEffect(() => {
    const emailQueryParam = searchParams? searchParams[1]: null;
    if (emailQueryParam) {
      setEmail(emailQueryParam);
    }
  }, [searchParams]);

  const handleVerifyOtp = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const result = await verifyOtpMutation.mutateAsync({ email, otp });
      // Assuming the token is returned upon successful OTP verification
      if (result.token) {
        Cookies.set('authToken', result.token, { expires: 7, secure: true, sameSite: 'strict' });
        alert('Email verified successfully');
        router.push('/category');
      }
    } catch (error) {
      alert(`Verification failed`);
    }
  };

  return (
    <form onSubmit={handleVerifyOtp}>
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
        <label htmlFor="otp">Enter OTP:</label>
        <input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
         Otp is 123456 for simplicity
      </div>
      <button type="submit" disabled={verifyOtpMutation.isPending}>Verify OTP</button>
    </form>
  );
};

export default VerifyOTPForm;
