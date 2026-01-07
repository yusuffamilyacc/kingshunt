 import { SectionHeading } from "@/components/section-heading";

 const coaches = [
  {
    name: "Ece Kurtuluş",
    title: "FIDE Trainer",
    bio: "Milli takım oyuncularına hazırlık kampları düzenledi, açılış repertuvarı ve atak stratejilerinde uzman.",
  },
  {
    name: "Mert Aksoy",
    title: "Kulüp Koçu",
    bio: "Düzenli antrenman ve maç sonrası analizlerde disiplinli yaklaşımıyla bilinir.",
  },
  {
    name: "Deniz Şen",
    title: "Performans Analisti",
    bio: "Veri odaklı hazırlık, psikolojik dayanıklılık ve zaman yönetimi üzerine çalışır.",
  },
  {
    name: "Selin Demir",
    title: "Gençler Koçu",
    bio: "Çocuk ve genç sporcular için yaratıcı taktik oyunlar ve motivasyon desteği sağlar.",
  },
 ];

 export default function CoachesPage() {
  return (
    <div className="bg-[#0b0b0b] text-white">
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-ink-900 to-ink-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(201,162,77,0.12),transparent_30%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionHeading
            align="center"
            eyebrow="Koçlar"
            title="Koçluk Ekibi"
            subtitle="Saldırı, strateji ve performans yönetimini birleştiren uzman kadro."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <div
              key={coach.name}
              className="rounded-2xl border border-white/5 bg-ink-900/90 p-6 shadow-xl shadow-black/30"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-black text-lg font-semibold">
                {coach.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <p className="text-lg font-semibold text-white">{coach.name}</p>
              <p className="text-sm text-gold-200">{coach.title}</p>
              <p className="mt-3 text-sm text-white/60">{coach.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
 }

