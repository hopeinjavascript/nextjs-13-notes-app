import NextAuth from 'next-auth/next';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'your credentials',
      type: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
        },
      },
      authorize: (credentials, req) => {
        // console.log({ credentials, body: req.body });

        // return either the user, null or throw an error

        // Add logic here to look up the user from the credentials supplied
        const user = { id: 1, name: 'A Sood', email: 'akshaysood@gmail.com' };

        // credentials will be that we pass in "signIn" function
        if (
          credentials.email === 'akshaysood@gmail.com' ||
          credentials.password === '123'
        ) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null or false then the credentials will be rejected
          return null;
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  // pages: {
  //   signIn: '/auth/signIn',
  // },
};

export default NextAuth(authOptions);
