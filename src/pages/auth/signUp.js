import React, { useState } from 'react';
import styles from '@/styles/CreateNote.module.css';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

const SignUp = () => {
  const refForm = React.useRef(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const name = refForm.current[0].value;
    const email = refForm.current[1].value;
    const password = refForm.current[2].value;

    if (!name || !email || !password) {
      setLoading(false);
      return alert('Fill in all the fields');
    }

    try {
      const res = await fetch('/api/auth/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (data.msg === 'User/Email already exists') {
        return refForm.current.reset(); // OR return e.target.reset();
      }

      router.push('/auth/signIn');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
        <h1 className="text-4xl mb-5">Register</h1>
        <form
          onSubmit={handleSubmit}
          ref={refForm}
          className={styles.notes_form}
        >
          <div className={styles.form_input}>
            <p className={styles.form_label}>Name</p>
            <input type="text" placeholder="Enter name" />
          </div>
          {/* <div className={styles.form_input}>
            <p className={styles.form_label}>Username</p>
            <input type="text" placeholder="Enter username" />
          </div> */}
          <div className={styles.form_input}>
            <p className={styles.form_label}>Email</p>
            <input type="email" placeholder="Enter email" />
          </div>
          <div className={styles.form_input}>
            <p className={styles.form_label}>Password</p>
            <input type="password" placeholder="Enter password" />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

// to prevent from navigating to sign up page if user is already logged in
export async function getServerSideProps(context) {
  const session = await getSession(context);

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

export default SignUp;
