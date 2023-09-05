import React from 'react';
import styles from '@/styles/CreateNote.module.css';
import Image from 'next/image';

const SignIn = () => {
  const refForm = React.useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = refForm.current[0].value;
    const email = refForm.current[1].value;
    const password = refForm.current[2].value;

    if (!name || !email || !password) return alert('Fill in all the fields');

    const res = await fetch('/api/auth/signUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    router.push('/auth/signIn');
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
          <button type="submit" className="btn_outline">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
