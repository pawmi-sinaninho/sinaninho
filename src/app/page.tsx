import LangToggle from '@/components/LangToggle';
import CompanionsGrid from '@/components/CompanionsGrid';

export default function Page() {
  return (
    <main className="min-h-dvh">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        {/* Hero */}
        <div
          className="h-48 md:h-72 bg-cover bg-center rounded-3xl shadow-lg"
          style={{ backgroundImage: "url('/images/hero.jpg')" }}
        />

        {/* Headerzeile */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Dofus Compagnons</h1>
          <LangToggle />
        </div>

        {/* Grid */}
        <CompanionsGrid />
      </div>
    </main>
  );
}
