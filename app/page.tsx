import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";

const programs = [
  {
    title: "Çocuk Programı (6-9)",
    description:
      "Temel taş güvenliği, açılış alışkanlıkları ve oyun sevgisini besleyen eğlenceli oturumlar.",
  },
  {
    title: "Genç Programı (10-14)",
    description:
      "Kombinasyon okuması, taktik bulma ve düzenli pratik maçlarla oyun görüşünü keskinleştirir.",
  },
  {
    title: "İleri / Turnuva",
    description:
      "Repertuvar oluşturma, maç sonrası analiz ve zaman yönetimi ile yarışmaya hazır hale getirir.",
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f6f1e7] to-[#efe6d7]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(201,162,77,0.14),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,12,12,0.04)_1px,transparent_1px)] bg-[length:120px_120px] opacity-50" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-24 text-center md:px-6 md:py-32 lg:text-left">
          <div className="mx-auto max-w-4xl space-y-6 lg:mx-0">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
              Şah Avı Akademi
            </p>
            <h1 className="text-4xl font-semibold leading-[1.05] text-[#0b0b0b] md:text-5xl lg:text-6xl">
              Şahı avla. Oyunu Kazan.
            </h1>
            <p className="text-lg text-[#3f3f3f] md:text-xl">
            Çocuklar ve yetişkinler için profesyonel dersler. Turnuva hazırlığı, stratejik ve analitik düşünme geliştirme ve psikolojik destek. İlk deneme dersiniz ücretsizdir (30 dakikaya kadar).
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <Link
              href="/programs"
              className="w-full rounded-full bg-gradient-to-r from-gold-400 to-amber-500 px-6 py-3 text-center text-sm font-semibold text-black shadow-lg shadow-gold-500/25 transition hover:-translate-y-0.5 hover:shadow-gold-400/40 sm:w-auto"
            >
              Ders Seçenekleri
            </Link>
            <Link
              href="/contact"
              className="w-full rounded-full border border-[#0b0b0b]/10 px-6 py-3 text-center text-sm font-semibold text-[#0b0b0b] transition hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-600 sm:w-auto"
            >
              Join KingsHunt
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#0b0b0b]/5 bg-gradient-to-br from-white to-[#f4ecde] shadow-xl shadow-black/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(201,162,77,0.18),transparent_32%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,12,12,0.04)_1px,transparent_1px)] bg-[length:80px_80px] opacity-60" />
            <div className="absolute inset-4 rounded-2xl border border-[#0b0b0b]/10" />
            <div className="absolute bottom-6 left-6 space-y-2">
              <p className="text-sm font-semibold text-gold-600">
                Taktik / Strateji
              </p>
              <p className="text-xs text-[#4a4a4a]">
                Her ders, şah atağı, şah güvenliği ve aktif oyun üzerine kurulu.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Kulüp kültürü"
              title="KingsHunt Nedir?"
              subtitle="Şah Avı Akademi, saldırı bilincini ve stratejik disiplini aynı anda geliştiren modern bir satranç topluluğudur."
            />
            <ul className="space-y-3 text-[#3f3f3f]">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold-500" />
                <div>
                  <p className="font-semibold text-[#0b0b0b]">
                    Şah saldırısı ve güvenliği öncelikli
                  </p>
                  <p className="text-sm text-[#4a4a4a]">
                    Oyun planı her zaman şah konumunu merkeze alır.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold-500" />
                <div>
                  <p className="font-semibold text-[#0b0b0b]">Saldırı zihniyeti</p>
                  <p className="text-sm text-[#4a4a4a]">
                    İnce hesaplı baskı ve inisiyatif kullanımı temel eğitimdir.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold-500" />
                <div>
                  <p className="font-semibold text-[#0b0b0b]">Stratejik disiplin</p>
                  <p className="text-sm text-[#4a4a4a]">
                    Açılıştan oyun sonuna kadar düzenli çalışma ve analiz rutini.
                  </p>
                </div>
              </li>
            </ul>
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
