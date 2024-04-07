// pages/index.tsx
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Turonver Category Selection</h1>
      <nav>
        <ul>
          <li>
            <Link href="/auth/login">Login</Link>
          </li>
          <li>
            <Link href="/auth/signup">Signup</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
