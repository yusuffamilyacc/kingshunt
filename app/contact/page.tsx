 import { SectionHeading } from "@/components/section-heading";

 export default function ContactPage() {
  return (
    <div className="bg-[#0b0b0b] text-white">
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-ink-900 to-ink-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,77,0.12),transparent_30%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionHeading
            align="center"
            eyebrow="İletişim"
            title="Contact KingsHunt"
            subtitle="Üyelik, özel ders veya turnuva kayıtları için bize ulaşın."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-3xl border border-white/5 bg-ink-900/90 p-6 shadow-2xl shadow-black/30 md:p-8">
            <h3 className="text-lg font-semibold text-white">Mesaj Gönder</h3>
            <p className="mt-2 text-sm text-white/60">
              Form sadece önyüz örneğidir. Taleplerinizi iletmek için alanları
              doldurun.
            </p>
            <form className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  placeholder="Adınız"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-ink-800/70 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-gold-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80">
                  E-posta
                </label>
                <input
                  type="email"
                  placeholder="ornek@mail.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-ink-800/70 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-gold-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80">
                  Mesaj
                </label>
                <textarea
                  rows={4}
                  placeholder="Mesajınızı yazın"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-ink-800/70 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-gold-400 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-full bg-gradient-to-r from-gold-400 to-amber-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-gold-500/30 transition hover:-translate-y-0.5 hover:shadow-gold-400/40"
              >
                Gönder
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/5 bg-ink-800/70 p-6">
              <h4 className="text-base font-semibold text-white">Kulüp Bilgileri</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li>
                  <span className="font-semibold text-white">Adres:</span> Moda,
                  Kadıköy / İstanbul
                </li>
                <li>
                  <span className="font-semibold text-white">Telefon:</span> +90
                  (216) 555 11 22
                </li>
                <li>
                  <span className="font-semibold text-white">E-posta:</span>{" "}
                  info@sahaviakademi.com
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/5 bg-ink-800/70 p-6">
              <h4 className="text-base font-semibold text-white">Sosyal</h4>
              <div className="mt-4 flex flex-wrap gap-3">
                {["Instagram", "YouTube", "X / Twitter", "Lichess"].map(
                  (platform) => (
                    <button
                      key={platform}
                      type="button"
                      className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-gold-400 hover:text-gold-200"
                    >
                      {platform}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
 }

