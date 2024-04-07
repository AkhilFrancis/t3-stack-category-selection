import React, { Suspense } from 'react';
import VerifyOTPForm from '../../_components/verifyotp-form';

const VerifyOtpPage = () => {
  return (
    <div>
      <h1>Verify Otp</h1>
      <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPForm />
      </Suspense>
    </div>
  );
};

export default VerifyOtpPage;
