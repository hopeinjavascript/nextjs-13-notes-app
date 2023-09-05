import { Inter } from 'next/font/google';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '@/styles/Notes.module.css';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const session = useSession();
  const router = useRouter();

  const handleSignUp = async () => router.push('/auth/signUp');

  const handleSignIn = async () => router.push('/auth/signIn');

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
          <button className="btn_outline" onClick={handleSignUp}>
            Register
          </button>
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
