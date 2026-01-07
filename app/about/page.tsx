 import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";

const pillars = [
  {
    title: "Eğitimin Faydaları",
    text: "Öğrenci için sonuçlar: Reyting artışı ve turnuvalarda daha istikrarlı oyun, dikkat, hafıza, mantık ve analitik düşünme gelişimi, turnuvalarda, kontrol ve sınavlarda özgüven, disiplin, planlama ve oyunları sonuna kadar getirme yeteneği, bireysel plan: hobi, güçlenme veya ciddi spor.",
  },
  {
    title: "Neden «Şah Avı»?",
    text: "Online okul sistematik yaklaşımı, canlı iletişimi ve her öğrenciye dikkatli tutumu birleştirir. Hazırlık: Amatörden turnuvalara kadar yol. Her seviyedeki öğrencilerle çalışıyoruz. Öğrencilerimiz ulusal ve uluslararası yarışmalara, Avrupa ve dünya şampiyonlarına katıldı.",
  },
  {
    title: "Yaklaşım",
    text: "Yapılandırılmış dersler. Açılış, orta oyun, oyun sonu, taktik, strateji, oyun analizi, ödevler ve ilerleme kontrolü — hepsi anlaşılır bir sisteme dönüştürülmüştür, bu da istikrarlı ve güvenli büyümeye yardımcı olur.",
  },
];

 export default function AboutPage() {
  return (
    <div className="text-[#0b0b0b]">
      <section className="relative overflow-hidden border-b border-[#0b0b0b]/5 bg-gradient-to-b from-white via-[#f4ecde] to-[#f7f4ec]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,162,77,0.14),transparent_30%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionHeading
            align="center"
            eyebrow="Hakkında"
            title="Online Satranç Okulu «Şah Avı»"
            subtitle="Çocuklar ve yetişkinler için profesyonel dersler. Turnuva hazırlığı, stratejik ve analitik düşünme gelişimi, psikolojik destek."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-[#0b0b0b]/5 bg-white shadow-xl shadow-black/10">
            <Image
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80"
              alt="Satranç öğrencileri"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#0b0b0b]/6 bg-white p-6 shadow-lg shadow-black/10"
            >
              <div className="mb-4 h-10 w-10 rounded-lg bg-gold-500/15 text-center text-lg font-semibold text-gold-700 ring-1 ring-inset ring-gold-500/40">
                ♜
              </div>
              <h3 className="text-lg font-semibold text-[#0b0b0b]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-[#4a4a4a]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
 }

