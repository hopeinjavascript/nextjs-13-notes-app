import React from 'react';
import styles from '@/styles/CreateNote.module.css';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const SignIn = () => {
  const refForm = React.useRef(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = refForm.current[0].value;
    const password = refForm.current[1].value;

    if (!email || !password) return alert('Fill in all the fields');

    const resp = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: 'http://localhost:3000/notes',
    });

    if (resp.ok) router.push(resp.url);
  };

  return (
    <div className={styles.notes_form_wrapper}>
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
          <button type="submit" className="btn_primary">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
