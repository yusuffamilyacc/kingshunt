 import { SectionHeading } from "@/components/section-heading";

const pillars = [
  {
    title: "Misyon & Vizyon",
    text: "Oyunculara disiplinli çalışma alışkanlığı kazandırırken, saldırı odaklı modern satranç dilini yaymak.",
  },
  {
    title: "Eğitim Felsefesi",
    text: "Şah güvenliği, inisiyatif ve taş harmonisi üzerine kurulu pratik odaklı dersler.",
  },
  {
    title: "Neden Şah Avı?",
    text: "Sürekli analiz, turnuva deneyimi ve topluluk desteği ile öğrenmeyi hızlandırıyoruz.",
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
            title="About KingsHunt"
            subtitle="Şah Avı Akademi, satrancı hedef odaklı ve ölçülebilir bir gelişim yolculuğu olarak ele alır."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
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

