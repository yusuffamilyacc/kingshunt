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
    <div className="text-[#0b0b0b]">
      <section className="relative overflow-hidden border-b border-[#0b0b0b]/5 bg-gradient-to-b from-white via-[#f4ecde] to-[#f7f4ec]">
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
            <h3 className="text-lg font-semibold text-[#0b0b0b]">Yaklaşan Etkinlikler</h3>
            <div className="rounded-2xl border border-[#0b0b0b]/6 bg-white shadow-lg shadow-black/5">
              {upcoming.map((event) => (
                <div
                  key={event.name}
                  className="flex flex-col gap-3 border-b border-[#0b0b0b]/5 px-6 py-5 last:border-none md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-[#0b0b0b]">{event.name}</p>
                    <p className="text-sm text-[#4a4a4a]">{event.location}</p>
                  </div>
                  <p className="text-sm font-medium text-gold-700">{event.date}</p>
                  <span className="rounded-full border border-gold-400/50 bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-800">
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0b0b0b]">Geçmiş Etkinlikler</h3>
            <div className="rounded-2xl border border-[#0b0b0b]/6 bg-[#f7f4ec] shadow-md shadow-black/5">
              {past.map((event) => (
                <div
                  key={event.name}
                  className="flex flex-col gap-3 border-b border-[#0b0b0b]/5 px-6 py-5 last:border-none md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-[#0b0b0b]">{event.name}</p>
                    <p className="text-sm text-[#4a4a4a]">{event.location}</p>
                  </div>
                  <p className="text-sm font-medium text-gold-700">{event.date}</p>
                  <span className="rounded-full border border-[#0b0b0b]/10 px-3 py-1 text-xs font-semibold text-[#4a4a4a]">
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

