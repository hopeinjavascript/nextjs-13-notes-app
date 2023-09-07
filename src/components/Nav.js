import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Theme from './Theme';
import Link from 'next/link';

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
      <Link href="/">
        <strong>
          <em>LOGO</em>
        </strong>
      </Link>

      {!session.data || session.status === 'unauthenticated' ? (
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <button className="btn_signUp_nav" onClick={handleSignUp}>
              Register
            </button>
            <button className="btn_signIn_nav" onClick={handleSignIn}>
              Login
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
