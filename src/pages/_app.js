import NotesContextProvider from '@/context/notes';
import ThemeContextProvider from '@/context/theme';
import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps }) {
  return (
    <ThemeContextProvider>
      <SessionProvider session={pageProps.session}>
        <NotesContextProvider>
          <Component {...pageProps} />
        </NotesContextProvider>
      </SessionProvider>
    </ThemeContextProvider>
  );
}
