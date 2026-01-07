 import Image from "next/image";
 import { SectionHeading } from "@/components/section-heading";

 const programDetails = [
  {
    title: "Yeni Başlayanlar",
    description:
      "Sıfırdan güvenli oyuna kadar. Kurallar ve temel oyun sonları, basit mat yapıları, açılış temelleri ve merkez kontrolü, ilk taktik motifler.",
    structure: [
      "Açılış, orta oyun, oyun sonu temelleri",
      "Taktik ve kombinasyon çalışması",
      "Oyun analizi ve ödevler",
    ],
    goals: [
      "Temel kuralları öğrenme",
      "Basit mat kalıplarını kavrama",
      "İlk taktik motifleri tanıma",
    ],
    pricing: "Bireysel dersler — 30, 45 veya 60 dakika",
    image: "https://images.unsplash.com/photo-1586165368502-1bad197e6461?w=600&q=80",
  },
  {
    title: "Orta Seviye",
    description:
      "Güçlenme ve reyting artışı. Öğrencinin stilini göz önünde bulundurarak açılış repertuvarı, orta oyunda tipik pozisyonlar ve planlar, derin taktik ve kombinasyonlar, kendi oyunlarının analizi.",
    structure: [
      "Açılış repertuvarı geliştirme",
      "Derin taktik çalışması",
      "Kendi oyunlarının analizi",
    ],
    goals: [
      "Açılış prensipleri ve repertuvar",
      "Taktik hesap derinliği",
      "Oyun sonu temel planlar",
    ],
    pricing: "Bireysel dersler — 30, 45 veya 60 dakika",
    image: "https://images.unsplash.com/photo-1528819622765-d6bcf132ac31?w=600&q=80",
  },
  {
    title: "Turnuvalar",
    description:
      "Ciddi hazırlık. Rakip oyunlarının analizi, derin açılış çalışmaları, karmaşık oyun sonları, yarışmalara psikolojik hazırlık.",
    structure: [
      "Rakip oyunlarının analizi",
      "Derin açılış çalışmaları",
      "Psikolojik hazırlık",
    ],
    goals: [
      "Derin analiz rutini",
      "Psikolojik hazırlık",
      "Reyting odaklı gelişim planı",
    ],
    pricing: "Bireysel dersler — 30, 45 veya 60 dakika",
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&q=80",
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
            subtitle="Her seviye için kendi programı, temposu ve vurguları. Ücretsiz deneme dersi ile başlayabilirsiniz."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="space-y-10">
          {programDetails.map((program) => (
            <div
              key={program.title}
              className="rounded-3xl border border-[#0b0b0b]/6 bg-white overflow-hidden shadow-xl shadow-black/10"
            >
              <div className="relative h-48 md:h-64">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-gold-300">
                    Program
                  </p>
                  <h2 className="text-2xl font-semibold text-white md:text-3xl mt-1">
                    {program.title}
                  </h2>
                </div>
              </div>
              <div className="p-8 md:p-10">
                <p className="text-sm text-[#4a4a4a] md:max-w-2xl md:text-base mb-6">
                  {program.description}
                </p>
                <div className="rounded-full border border-gold-400/50 bg-gold-500/15 px-4 py-2 text-sm font-semibold text-gold-800 inline-block mb-6">
                  {program.pricing}
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

