import { Inter } from 'next/font/google';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '@/styles/Notes.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const session = useSession();

  const handleSignIn = async () => {
    const resp = await signIn('credentials', {
      redirect: false,
      email: 'akshaysood@gmail.com', // hardcoded
      password: '123', // hardcoded
    });
    // signIn('google', { callbackUrl: 'http://localhost:3000/notes' })

    console.log(resp);
  };

  const handleSignOut = () => signOut({ redirect: false });

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}
    >
      {!session.data || session.status === 'unauthenticated' ? (
        <>
          <Link href="/notes">
            <h1 className={styles.heading}>Notes App</h1>
          </Link>
          <button className="btn_outline" onClick={handleSignIn}>
            Login
          </button>
        </>
      ) : (
        <>
          <h1 className={styles.heading}>
            Welcome {session.data.user.name}, access your notes {'  '}
            <Link href="/notes">
              <u>here.</u>
            </Link>
          </h1>
          <button className="btn_outline" onClick={handleSignOut}>
            Logout
          </button>
        </>
      )}
    </main>
  );
}
