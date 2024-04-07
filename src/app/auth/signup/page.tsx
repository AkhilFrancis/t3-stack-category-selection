import React from 'react';
import SignUpForm from '../../_components/signup-form';
import Link from 'next/link';

const SignUpPage = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm />
      Already have an account?{' '}
        <Link href="/auth/login">
          Login Here
        </Link>
    </div>
  );
};

export default SignUpPage;
