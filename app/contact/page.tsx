 import Image from "next/image";
 import { SectionHeading } from "@/components/section-heading";

 export default function ContactPage() {
  return (
    <div className="text-[#0b0b0b]">
      <section className="relative overflow-hidden border-b border-[#0b0b0b]/5 bg-gradient-to-b from-white via-[#f4ecde] to-[#f7f4ec]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,77,0.12),transparent_30%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionHeading
            align="center"
            eyebrow="İletişim"
            title="Derslere Kayıt Olun"
            subtitle="WhatsApp üzerinden bize yazın — sizin veya çocuğunuz için format, süre ve program seçeceğiz."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-3xl border border-[#0b0b0b]/6 bg-white overflow-hidden shadow-xl shadow-black/10">
            <div className="relative h-48">
              <Image
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"
                alt="İletişim"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-[#0b0b0b]">WhatsApp ile İletişime Geçin</h3>
            <p className="mt-2 text-sm text-[#4a4a4a]">
              Aşağıdaki bilgileri doldurun ve WhatsApp üzerinden hazır mesajla iletişime geçin.
            </p>
            <form className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0b0b0b]/80">
                  Adınız
                </label>
                <input
                  type="text"
                  placeholder="Adınız"
                  className="mt-2 w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] placeholder:text-[#4a4a4a]/60 focus:border-gold-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0b0b0b]/80">
                  Çocuğun Adı
                </label>
                <input
                  type="text"
                  placeholder="Çocuğun adı"
                  className="mt-2 w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] placeholder:text-[#4a4a4a]/60 focus:border-gold-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0b0b0b]/80">
                  Çocuğun Yaşı
                </label>
                <input
                  type="text"
                  placeholder="Yaş"
                  className="mt-2 w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] placeholder:text-[#4a4a4a]/60 focus:border-gold-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0b0b0b]/80">
                  İletişim (WhatsApp / Telegram)
                </label>
                <input
                  type="text"
                  placeholder="Telefon numarası"
                  className="mt-2 w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] placeholder:text-[#4a4a4a]/60 focus:border-gold-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0b0b0b]/80">
                  Ders Hedefi
                </label>
                <textarea
                  rows={3}
                  placeholder="Hobi, güçlenme veya turnuva hazırlığı"
                  className="mt-2 w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] placeholder:text-[#4a4a4a]/60 focus:border-gold-400 focus:outline-none"
                />
              </div>
              <a
                href="https://wa.me/994504124721"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full bg-gradient-to-r from-gold-400 to-amber-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-gold-500/30 transition hover:-translate-y-0.5 hover:shadow-gold-400/40 flex items-center justify-center gap-2"
              >
                WhatsApp&apos;ta Mesaj Gönder
              </a>
            </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#0b0b0b]/6 bg-white p-6 shadow-lg shadow-black/5">
              <h4 className="text-base font-semibold text-[#0b0b0b]">İletişim Bilgileri</h4>
              <ul className="mt-4 space-y-3 text-sm text-[#4a4a4a]">
                <li>
                  <span className="font-semibold text-[#0b0b0b]">📱 WhatsApp:</span> +994 50 412 47 21
                </li>
                <li>
                  <span className="font-semibold text-[#0b0b0b]">🌍 Eğitim Dili:</span> Türkçe / Rusça
                </li>
                <li>
                  <span className="font-semibold text-[#0b0b0b]">🧩 Format:</span> Bireysel ve mini gruplar
                </li>
              </ul>
              <p className="mt-4 text-xs text-[#4a4a4a]">
                Mesajda yazabilirsiniz: yaş, yaklaşık seviye / reyting (varsa) ve ders hedefi (hobi, güçlenme, turnuva hazırlığı).
              </p>
            </div>

            <div className="rounded-2xl border border-[#0b0b0b]/6 bg-white p-6 shadow-lg shadow-black/5">
              <h4 className="text-base font-semibold text-[#0b0b0b]">Sosyal</h4>
              <div className="mt-4 flex flex-wrap gap-3">
                {["Instagram", "YouTube", "X / Twitter", "Lichess"].map(
                  (platform) => (
                    <button
                      key={platform}
                      type="button"
                      className="rounded-full border border-[#0b0b0b]/15 px-4 py-2 text-xs font-semibold text-[#0b0b0b]/80 transition hover:border-gold-400 hover:text-gold-600"
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

