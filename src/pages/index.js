import { Inter } from 'next/font/google';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

// https://storyset.com/ => for illustrations

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const session = useSession();

  let btnText = 'Get Started',
    btnLink = '/auth/signUp';
  if (session.data || session.status === 'authenticated') {
    btnText = 'View your notes';
    btnLink = '/notes';
  }

  return (
    <main className="page-section">
      <div className="left hero-left">
        <h2 className="headline hero-headline">
          Single place for all your <Link href="/notes">notes</Link>
        </h2>
        <p className="secondary-headline">
          Maintaining notes helps one to keep things to do in place. You don't
          have to remember and keep counting on things that are important, just
          note them down and you are good to go. I encourage you to create and
          maintain one!
        </p>
        <Link href={btnLink}>
          <button className="btn-primary btn-hero">{btnText}</button>
        </Link>
      </div>
      <div className="right">
        <Image
          src="/notes-pana.png"
          // src="/hero-img-removebg.png"
          width={500}
          height={500}
          alt="hero image"
        />
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      name: 'akshay', // just!
      session, // * returning session is important
    },
  };
}
