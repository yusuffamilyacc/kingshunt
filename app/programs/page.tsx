 import { SectionHeading } from "@/components/section-heading";

 const programDetails = [
  {
    title: "Çocuk Programı (6-9)",
    description:
      "Oyun sevgisini besleyen, temel kurallar ve taş koordinasyonunu pekiştiren eğlenceli seanslar.",
    structure: [
      "Haftada 2 ders (45 dk)",
      "Mini oyunlar ve bulmacalar",
      "Aile katılımı için aylık rapor",
    ],
    goals: [
      "Şah güvenliği alışkanlığı",
      "Basit mat kalıpları",
      "Taş değerlerini kavrama",
    ],
    pricing: "Aylık paket — 1200₺",
  },
  {
    title: "Genç Programı (10-14)",
    description:
      "Taktik ve konumsal anlayışı dengeleyen, düzenli pratik maçlarla desteklenen yoğun program.",
    structure: [
      "Haftada 3 ders (60 dk)",
      "Turnuva temposunda pratik",
      "Video geri bildirimleri",
    ],
    goals: [
      "Açılış prensipleri ve repertuvar",
      "Taktik hesap derinliği",
      "Oyun sonu temel planlar",
    ],
    pricing: "Aylık paket — 1500₺",
  },
  {
    title: "İleri / Turnuva",
    description:
      "Repertuvar mühendisliği, maç analizi ve zaman yönetimi odaklı performans programı.",
    structure: [
      "Haftada 3 ders (75 dk)",
      "Haftalık sparring ve analiz",
      "Bire bir hedef takibi",
    ],
    goals: [
      "Derin analiz rutini",
      "Psikolojik hazırlık",
      "ELO odaklı gelişim planı",
    ],
    pricing: "Aylık paket — 1900₺",
  },
 ];

export default function ProgramsPage() {
  return (
    <div className="text-[#0b0b0b]">
      <section className="relative overflow-hidden border-b border-[#0b0b0b]/5 bg-gradient-to-b from-white via-[#f4ecde] to-[#f7f4ec]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(201,162,77,0.12),transparent_32%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionHeading
            align="center"
            eyebrow="Programlar"
            title="Eğitim Programları"
            subtitle="Yaş gruplarına göre ayrılmış, ölçülebilir hedefler içeren satranç yolculukları."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="space-y-10">
          {programDetails.map((program) => (
            <div
              key={program.title}
              className="rounded-3xl border border-[#0b0b0b]/6 bg-white p-8 shadow-xl shadow-black/10 md:p-10"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-gold-400">
                    Program
                  </p>
                  <h2 className="text-2xl font-semibold text-[#0b0b0b] md:text-3xl">
                    {program.title}
                  </h2>
                  <p className="mt-3 text-sm text-[#4a4a4a] md:max-w-2xl md:text-base">
                    {program.description}
                  </p>
                </div>
                <div className="rounded-full border border-gold-400/50 bg-gold-500/15 px-4 py-2 text-sm font-semibold text-gold-800">
                  {program.pricing}
                </div>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-[#0b0b0b]/5 bg-[#f7f4ec] p-6">
                  <p className="text-sm font-semibold text-gold-700">
                    Haftalık Yapı
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-[#4a4a4a]">
                    {program.structure.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-gold-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#0b0b0b]/5 bg-[#f7f4ec] p-6">
                  <p className="text-sm font-semibold text-gold-700">Hedefler</p>
                  <ul className="mt-3 space-y-2 text-sm text-[#4a4a4a]">
                    {program.goals.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-gold-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

