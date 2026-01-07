 import { SectionHeading } from "@/components/section-heading";

 const upcoming = [
  {
    name: "Golden King Blitz",
    date: "15 Şubat 2026",
    location: "Online",
    status: "Yaklaşıyor",
  },
  {
    name: "Kadıköy Açık",
    date: "2 Mart 2026",
    location: "İstanbul",
    status: "Kayıt Açık",
  },
 ];

 const past = [
  {
    name: "Kış Rapid",
    date: "Aralık 2025",
    location: "Online",
    status: "Tamamlandı",
  },
  {
    name: "Sonbahar Klasik",
    date: "Ekim 2025",
    location: "İstanbul",
    status: "Tamamlandı",
  },
 ];

 export default function TournamentsPage() {
  return (
    <div className="bg-[#0b0b0b] text-white">
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-ink-900 to-ink-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(201,162,77,0.14),transparent_32%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionHeading
            align="center"
            eyebrow="Turnuvalar"
            title="Turnuva Takvimi"
            subtitle="Yaklaşan online ve yüz yüze etkinlikler ile tamamlanan organizasyonlar."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Yaklaşan Etkinlikler</h3>
            <div className="rounded-2xl border border-white/5 bg-ink-900/90">
              {upcoming.map((event) => (
                <div
                  key={event.name}
                  className="flex flex-col gap-3 border-b border-white/5 px-6 py-5 last:border-none md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-white">{event.name}</p>
                    <p className="text-sm text-white/60">{event.location}</p>
                  </div>
                  <p className="text-sm font-medium text-gold-200">{event.date}</p>
                  <span className="rounded-full border border-gold-400/40 bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-100">
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Geçmiş Etkinlikler</h3>
            <div className="rounded-2xl border border-white/5 bg-ink-800/70">
              {past.map((event) => (
                <div
                  key={event.name}
                  className="flex flex-col gap-3 border-b border-white/5 px-6 py-5 last:border-none md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-white">{event.name}</p>
                    <p className="text-sm text-white/60">{event.location}</p>
                  </div>
                  <p className="text-sm font-medium text-gold-200">{event.date}</p>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
 }

