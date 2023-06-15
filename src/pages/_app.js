import NotesContextProvider from '@/context/notes';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <NotesContextProvider>
      <Component {...pageProps} />
    </NotesContextProvider>
  );
}
