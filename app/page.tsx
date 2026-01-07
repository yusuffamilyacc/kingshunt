import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";

const programs = [
  {
    title: "Yeni Başlayanlar",
    description:
      "Sıfırdan güvenli oyuna kadar. Kurallar ve temel oyun sonları, basit mat yapıları, açılış temelleri ve merkez kontrolü, ilk taktik motifler.",
  },
  {
    title: "Orta Seviye",
    description:
      "Güçlenme ve reyting artışı. Öğrencinin stilini göz önünde bulundurarak açılış repertuvarı, orta oyunda tipik pozisyonlar ve planlar, derin taktik ve kombinasyonlar, kendi oyunlarının analizi.",
  },
  {
    title: "Turnuvalar",
    description:
      "Ciddi hazırlık. Rakip oyunlarının analizi, derin açılış çalışmaları, karmaşık oyun sonları, yarışmalara psikolojik hazırlık.",
  },
];

const events = [
  { name: "Golden King Blitz", type: "Online", date: "15 Şubat 2026" },
  { name: "Kadıköy Açık", type: "OTB", date: "2 Mart 2026" },
  { name: "Spring Rapid", type: "Online", date: "19 Mart 2026" },
];

const coaches = [
  {
    name: "Ece Kurtuluş",
    title: "FIDE Trainer",
    bio: "Milli takım kamplarında görev almış, taktik keskinliğiyle bilinir.",
  },
  {
    name: "Mert Aksoy",
    title: "Kulüp Koçu",
    bio: "Disiplinli açılış hazırlığı ve oyun sonu düzeni üzerine uzman.",
  },
  {
    name: "Deniz Şen",
    title: "Performans Analisti",
    bio: "Maç verisi okuma ve psikolojik hazırlıkta oyunculara destek olur.",
  },
];

export default function Home() {
  return (
    <div className="text-[#0b0b0b]">
      {/* Hero */}
      <section className="relative overflow-hidden py-8 md:py-12 bg-gradient-to-br from-white via-[#f8f3ea] to-[#efe6d7]">
        {/* Decorative gradient overlays */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_38%,rgba(201,162,77,0.13),transparent_32%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,12,12,0.032)_1px,transparent_1px)] bg-[length:90px_90px] opacity-40" />
        </div>

        {/* Responsive content row */}
        <div className="relative z-10 mx-auto flex flex-col-reverse items-center gap-12 px-4 md:flex-row md:gap-8 md:px-6 max-w-6xl">
          {/* Left Side: Text + List + CTA */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 justify-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-500 mb-2">
                Şah Avı Akademi
              </p>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#101010] mb-5 leading-tight">
                Kralı Avlamaya<br className="hidden md:inline" /> Hazır mısın?
              </h1>
              <p className="text-base md:text-lg text-[#444] font-medium max-w-xl mb-4">
                Çocuklar ve yetişkinler için profesyonel satranç eğitimi. Turnuva hazırlığı, stratejik ve analitik düşünme gelişimi, psikolojik destek. İlk deneme dersiniz ücretsizdir (30 dakikaya kadar).
              </p>
              <p className="text-sm md:text-base font-semibold text-gold-800">
                💬 Dersler online olarak yapılmaktadır (Zoom, Lichess, Chess.com). Eğitim dili: Türkçe / Rusça.
              </p>
            </div>
            {/* Key features as icons list */}
            <ul className="space-y-3 mt-1">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold-500 border border-white shadow-md"></span>
                <div>
                  <span className="text-sm md:text-base font-semibold text-[#3b2a17]">
                    FIDE Ustası
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold-500 border border-white shadow-md"></span>
                <div>
                  <span className="text-sm md:text-base font-semibold text-[#3b2a17]">
                    10+ yıl öğretim deneyimi
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold-500 border border-white shadow-md"></span>
                <div>
                  <span className="text-sm md:text-base font-semibold text-[#3b2a17]">
                    Modern &amp; yapay zeka ile desteklenen öğrenme
                  </span>
                </div>
              </li>
            </ul>

            {/* Pill style highlights */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center rounded-full bg-gold-100 px-4 py-1 text-xs md:text-sm font-medium text-gold-700 border border-gold-200 shadow-sm">
                FIDE Ustası
              </span>
              <span className="inline-flex items-center rounded-full bg-gold-50 px-4 py-1 text-xs md:text-sm font-medium text-gold-700 border border-gold-100 shadow-sm">
                1-2 Ayda gelişim farkı
              </span>
              <span className="inline-flex items-center rounded-full bg-gold-100 px-4 py-1 text-xs md:text-sm font-medium text-gold-700 border border-gold-200 shadow-sm">
                Onlarca milli sporcu
              </span>
            </div>

           
          </div>

          {/* Right Side: Illustrative image area */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center relative">
            <div className="relative bg-gradient-to-br from-white/70 to-[#ecdfcb] rounded-3xl p-6 shadow-xl shadow-black/10 border border-[#be521c]/10 flex flex-col items-center min-h-[320px] w-full max-w-md">
              {/* Chess piece images in layered style */}
              <div className="relative flex justify-center items-end h-full w-full mt-2">
                <img
                  src="/images/pawn.png"
                  alt="Pawn"
                  className="h-[140px] md:h-[170px] absolute left-2 bottom-2 z-10 opacity-80"
                  style={{ filter: "drop-shadow(0 2px 8px #be521c22)" }}
                />
                <img
                  src="/images/king.png"
                  alt="King"
                  className="h-[170px] md:h-[210px] mx-auto z-20 relative"
                  style={{ filter: "drop-shadow(0 4px 14px #be521c33)" }}
                />
                <img
                  src="/images/queen.png"
                  alt="Queen"
                  className="h-[140px] md:h-[170px] absolute right-2 bottom-2 z-10 opacity-80"
                  style={{ filter: "drop-shadow(0 2px 8px #be521c22)" }}
                />
              </div>
              {/* Info tag */}
               {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link
                href="/programs"
                className="rounded-full bg-gradient-to-r from-gold-400 to-amber-500 px-7 py-3 text-center text-sm md:text-base font-bold text-black shadow-lg shadow-gold-500/15 transition hover:-translate-y-0.5 hover:shadow-gold-400/60"
              >
                Ders Seçenekleri
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-[#be521c]/10 px-7 py-3 text-center text-sm md:text-base font-semibold text-[#0b0b0b] bg-white/70 hover:border-gold-400 hover:text-gold-600 transition"
              >
                Kulübe Katıl
              </Link>
            </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#0b0b0b]/5 bg-gradient-to-br from-white to-[#f4ecde] shadow-xl shadow-black/10">
            <Image
              src="/images/image1.jpg"
              alt="Satranç eğitimi"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <p className="text-sm font-semibold text-white">
                Taktik / Strateji
              </p>
              <p className="text-xs text-white/90">
                Her ders, şah atağı, şah güvenliği ve aktif oyun üzerine kurulu.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Okul hakkında"
              title="Online Satranç Okulu «Şah Avı»"
              subtitle="Satranç dikkat, hafıza, mantık ve özgüven geliştirir — biz de bu yolu anlaşılır ve ilginç hale getirmeye yardımcı oluyoruz."
            />
            <div className="space-y-4 text-[#3f3f3f]">
              <p className="text-base">
                Satranç üzerinde doğru çalışma sadece reytingi değil, aynı zamanda karakteri, özgüveni ve düşünmeyi de etkiler.
              </p>
              <p className="text-base">
                Profesyonel satranç yaklaşımını psikolojik destek ve düşünme gelişimi ile birleştiriyoruz. Bu, öğrencilerin sadece tahta başında değil, okulda, sınavlarda ve günlük hayatta kendilerini daha güvenli hissetmelerine yardımcı olur.
              </p>
              <p className="text-base">
                Program her öğrenci için bireysel olarak seçilir: bazıları ciddi turnuva sonuçlarına gider, bazıları zevk ve zeka gelişimi için çalışır. Her durumda amaç aynıdır — güçlü bir satranç oyuncusu gibi düşünmeyi öğretmek ve oyundan zevk almak.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0b0b0b]/10 px-5 py-2.5 text-sm font-semibold text-[#0b0b0b] transition hover:border-gold-400 hover:text-gold-600"
            >
              Daha Fazla Öğren
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-[#f1ecdf]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="flex flex-col gap-10">
            <SectionHeading
              eyebrow="Eğitim"
              title="Eğitim Programları"
              subtitle="Yaşa ve hedefe göre yapılandırılmış, uygulanabilir haftalık planlar."
            />
            <div className="grid gap-6 md:grid-cols-3">
              {programs.map((program) => (
                <div
                  key={program.title}
                  className="group rounded-2xl border border-[#0b0b0b]/5 bg-gradient-to-br from-white to-[#f7f2e7] p-6 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-gold-400/60"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600 ring-1 ring-inset ring-gold-400/40">
                    <span className="text-lg">♟︎</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#0b0b0b]">
                    {program.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#4a4a4a]">
                    {program.description}
                  </p>
                  <Link
                    href="/programs"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition hover:text-gold-600"
                  >
                    Programı Gör
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tournaments */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Takvim"
            title="Turnuvalar ve Etkinlikler"
            subtitle="Online ve yüz yüze organizasyonlarla düzenli rekabet ortamı."
          />
          <div className="overflow-hidden rounded-2xl border border-[#0b0b0b]/5 bg-white/80 shadow-md shadow-black/5">
            {events.map((event) => (
              <div
                key={event.name}
                className="flex flex-col gap-4 border-b border-[#0b0b0b]/5 px-6 py-5 last:border-none md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-[#0b0b0b]">
                    {event.name}
                  </p>
                  <p className="text-sm text-[#4a4a4a]">{event.type}</p>
                </div>
                <p className="text-sm font-medium text-gold-700">{event.date}</p>
              </div>
            ))}
          </div>
          <Link
            href="/tournaments"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0b0b0b]/10 px-5 py-2.5 text-sm font-semibold text-[#0b0b0b] transition hover:border-gold-400 hover:text-gold-600"
          >
            Tüm Etkinlikler
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Coaches */}
      <section className="bg-[#f1ecdf]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="flex flex-col gap-10">
            <SectionHeading
              eyebrow="Ekip"
              title="Koçlarımız"
              subtitle="FIDE sertifikalı eğitmenler ve yarışma deneyimi yüksek analistler."
            />
            <div className="grid gap-6 md:grid-cols-3">
              {coaches.map((coach) => (
                <div
                  key={coach.name}
                  className="rounded-2xl border border-[#0b0b0b]/6 bg-white p-6 shadow-lg shadow-black/10"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-black text-xl font-semibold">
                    {coach.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <p className="text-lg font-semibold text-[#0b0b0b]">
                    {coach.name}
                  </p>
                  <p className="text-sm text-gold-700">{coach.title}</p>
                  <p className="mt-3 text-sm text-[#4a4a4a]">{coach.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/12 via-gold-400/10 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-[#0b0b0b]/8 bg-white/90 px-6 py-12 text-center shadow-xl shadow-black/10 md:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-500">
              Katılım
            </p>
            <h3 className="text-3xl font-semibold text-[#0b0b0b] md:text-4xl">
              Şah avına hazır mısın?
            </h3>
            <p className="max-w-2xl text-sm text-[#3f3f3f] md:text-base">
              Üyelik, koçluk ve turnuva kayıtları hakkında detaylı bilgi için
              ekibimizle iletişime geçin.
            </p>
            <Link
              href="/contact"
              className="rounded-full bg-gradient-to-r from-gold-400 to-amber-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-gold-500/25 transition hover:-translate-y-0.5 hover:shadow-gold-400/40"
            >
              Üye Ol
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
