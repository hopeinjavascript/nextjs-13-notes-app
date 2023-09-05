import NextAuth from 'next-auth/next';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectToDB from '@/connections/mongoose';
import UserModel from '@/models/user';

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
      authorize: async (credentials, req) => {
        // * return either the user, null or throw an error

        // Add logic here to look up the user from the credentials supplied

        await connectToDB();

        const { email, password } = credentials;

        if (!email || !password) throw new Error('All fields are required');

        const user = await UserModel.findOne({ email });

        if (!user) throw new Error('Invalid credentials');

        const hasPasswordMatched = await bcrypt.compare(
          password,
          user.password
        );

        if (!hasPasswordMatched) throw new Error('Invalid credentials');

        // Any object returned will be saved in `user` property of the JWT
        return user;
      },
    }),
  ],
  // https://stackoverflow.com/questions/71185287/pass-more-data-to-session-in-next-auth
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // the user present here gets the same data as received from DB call  made above
      // if check is imp because jwt callback is run twice. find out why?
      if (user) {
        token.id = user?._id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      // user param present in the session(function) does not receive all the data from DB call
      session.user.id = token.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  // pages: {
  //   signIn: '/auth/signIn',
  // },
};

export default NextAuth(authOptions);
