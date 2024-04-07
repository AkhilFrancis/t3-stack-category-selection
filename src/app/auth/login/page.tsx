import React from 'react';
import LoginForm from '../../_components/login-form';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      <p>
        Dont have an account?{' '}
        <Link href="/auth/signup">
          Sign Up Here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
