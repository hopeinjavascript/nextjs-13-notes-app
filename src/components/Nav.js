import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Theme from './Theme';
import Link from 'next/link';
import Image from 'next/image';

const Nav = () => {
  const session = useSession();
  const router = useRouter();

  const handleSignUp = async () => router.push('/auth/signUp');

  const handleSignIn = async () => router.push('/auth/signIn');

  const handleSignOut = () => {
    signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav>
      <Link href="/" className="logo">
        <Image src="/note-logo-color.png" width={35} height={35} alt="logo" />
        <h6>
          <strong>Notes App</strong>
        </h6>
      </Link>

      {!session.data || session.status === 'unauthenticated' ? (
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <button className="btn_signIn_nav" onClick={handleSignIn}>
              Login
            </button>
            <button className="btn_signUp_nav" onClick={handleSignUp}>
              Register
            </button>
          </div>
          <Theme />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button className="btn_logout_nav" onClick={handleSignOut}>
            Logout
          </button>
          <Theme />
        </div>
      )}
    </nav>
  );
};

export default Nav;
