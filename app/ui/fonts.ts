import { Inter, Playwrite_IT_Moderna, Lusitana } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] }); // signifie que nous chargeons seulement les caractères latins (lettres A-Z, accents, etc.).

export const playwrite = Playwrite_IT_Moderna({});

export const lusitana = Lusitana({
  subsets: ['latin'],
  weight: ['400', '700'],
});
