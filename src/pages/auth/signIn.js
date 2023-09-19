import React, { useState } from 'react';
import styles from '@/styles/CreateNote.module.css';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FiLock } from 'react-icons/fi';
import IconButton from '@/components/IconButton';
import Loader from '@/components/Loader';

const SignIn = () => {
  const refForm = React.useRef(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const email = refForm.current[0].value;
    const password = refForm.current[1].value;

    if (!email || !password) {
      setLoading(false);
      return alert('Fill in all the fields');
    }

    try {
      const resp = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: `${process.env.NEXT_PUBLIC_URL}/notes`, // why this doesn't work? it returns http://localhost:3000
      });

      // if (resp.ok) router.push(resp.url);
      if (resp.ok) router.push(`${process.env.NEXT_PUBLIC_URL}/notes`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      refForm.current.reset(); // OR return e.target.reset();
    }
  };

  return (
    <div className={styles.form_wrapper}>
      {/* <div className={styles.left}>
        <Image
          src="http://unsplash.it/450"
          width={400}
          height={400}
          alt="create note"
        />
      </div> */}
      <div className={styles.right}>
        <h1 className="text-4xl mb-5">Login</h1>
        <form
          onSubmit={handleSubmit}
          ref={refForm}
          className={styles.notes_form}
        >
          <div className={styles.form_input}>
            <p className={styles.form_label}>Email</p>
            <input
              type="email"
              placeholder="Enter email"
              defaultValue="akshaysood@gmail.com"
            />
          </div>
          <div className={styles.form_input}>
            <p className={styles.form_label}>Password</p>
            <input
              type="password"
              placeholder="Enter password"
              defaultValue="akshaysood"
            />
          </div>

          {loading ? (
            <IconButton
              btnText="Authenticating..."
              btnIcon={<Loader />}
              btnType="primary"
              isLoading={loading}
            />
          ) : (
            <IconButton
              btnText="Authenticate"
              btnIcon={<FiLock />}
              btnType="primary"
              isLoading={loading}
            />
          )}
        </form>
      </div>
    </div>
  );
};

// to prevent from navigating to sign in page if user is already logged in
export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session);

  if (session) {
    return {
      redirect: {
        destination: `${process.env.NEXTAUTH_URL}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      // (1.)
      // when we send this, it is received in the client side as an evaluated session (whether authenticated/unauthenticated) via SessionProvider. useSession first checks for session passed by SessionProvider and hence, it is always in the "authenticated/unauthenticated" mode, there is no "loading" status.
      session,
    },
  };
}

export default SignIn;
