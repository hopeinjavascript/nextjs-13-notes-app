import NotesContextProvider from '@/context/notes';
import ThemeContextProvider from '@/context/theme';
import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import Nav from '@/components/Nav';
import '../styles/nav.css';
import '../styles/home.css';
import Toast from '@/components/Toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toast />
      <ThemeContextProvider>
        <SessionProvider session={pageProps.session}>
          <Nav />
          <NotesContextProvider>
            <Component {...pageProps} />
          </NotesContextProvider>
        </SessionProvider>
      </ThemeContextProvider>
    </>
  );
}
