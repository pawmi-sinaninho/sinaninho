import './globals.css';
import { LangProvider } from '@/contexts/LangContext';
import { DataProvider } from '@/contexts/DataContext'; // hast du schon

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <LangProvider>
          <DataProvider>{children}</DataProvider>
        </LangProvider>
        <div
  className="h-48 md:h-72 bg-cover bg-center rounded-3xl mb-6"
  style={{ backgroundImage: "url('/images/hero.png')" }}
/>

      </body>
    </html>
  );
}
