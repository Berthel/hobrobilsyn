import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#2D3748] text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-1 h-4 bg-[#4361EE]"></div>
              Kontakt
            </h3>
            <div className="space-y-2">
              <p className="font-medium">Hobro Bilsyn</p>
              <p>Smedevej 5, 9500 Hobro</p>
              <p>T: <a href="tel:+4520856483" className="hover:text-white">+45 2085 6483</a></p>
              <p>M: <a href="mailto:kontakt@hobrobilsyn.dk" className="hover:text-white">kontakt@hobrobilsyn.dk</a></p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-1 h-4 bg-[#4361EE]"></div>
              Åbningstider
            </h3>
            <div className="space-y-2">
              <div>
                <p className="italic">Mandag – Torsdag:</p>
                <p>08:00 – 16:00</p>
              </div>
              <div>
                <p className="italic">Fredag:</p>
                <p>08:00 – 14:00</p>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-1 h-4 bg-[#4361EE]"></div>
              Nyttige Links
            </h3>
            <div className="space-y-2">
              <Link href="https://motorregister.skat.dk" className="block hover:text-white">
                Motorregister
              </Link>
              <Link href="#" className="block hover:text-white">
                Synsrapporter
              </Link>
              <Link href="https://www.fstyr.dk" className="block hover:text-white">
                Færdelsstyrelsen
              </Link>
              <Link href="/login" className="block hover:text-white">
                Forhandlerlogin
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <div className="container py-4 text-sm text-gray-400">
          Copyright © 2024 Hobro Bilsyn. Alle rettigheder forbeholdes.
        </div>
      </div>
    </footer>
  );
}