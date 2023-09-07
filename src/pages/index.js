import { Inter } from 'next/font/google';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '@/styles/Notes.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const session = useSession();

  return (
    <main
      className={`flex flex-col items-center justify-center p-24 ${inter.className}`}
    >
      {!session.data || session.status === 'unauthenticated' ? (
        <>
          <Link href="/notes">
            <h1 className={styles.heading}>Notes App</h1>
          </Link>
        </>
      ) : (
        <>
          <h1 className={styles.heading}>
            Welcome {session.data.user.name}, access your notes {'  '}
            <Link href="/notes">
              <u>here.</u>
            </Link>
          </h1>
        </>
      )}
    </main>
  );
}
