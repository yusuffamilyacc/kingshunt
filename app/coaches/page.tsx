 import Image from "next/image";
 import { SectionHeading } from "@/components/section-heading";

 const coaches = [
  {
    name: "Teymur Başırov Rafikoviç",
    title: "FIDE Ustası, «Şah Avı» Okulu Baş Antrenörü",
    bio: "Teymur 10 yıldan fazla satranç antrenörü olarak çalışıyor, farklı seviyelerde hazırlık yapan çocukları ve yetişkinleri eğitiyor. Onun rehberliğinde öğrenciler ulusal şampiyonalara, Avrupa ve dünya şampiyonlarına katıldı. Çalışmada sadece teknik ve açılış, orta oyun ve oyun sonu bilgilerine değil, aynı zamanda mantıksal, stratejik ve analitik düşünme gelişimine de vurgu yapıyor.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
 ];

 export default function CoachesPage() {
  return (
    <div className="text-[#0b0b0b]">
      <section className="relative overflow-hidden border-b border-[#0b0b0b]/5 bg-gradient-to-b from-white via-[#f4ecde] to-[#f7f4ec]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(201,162,77,0.12),transparent_30%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionHeading
            align="center"
            eyebrow="Antrenör"
            title="Baş Antrenör Hakkında"
            subtitle="«Şah Avı» okulunun yüzü — büyük deneyime sahip profesyonel antrenör ve her öğrenciye canlı tutum."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="space-y-8">
          {coaches.map((coach) => (
            <div
              key={coach.name}
              className="rounded-2xl border border-[#0b0b0b]/6 bg-white p-8 shadow-xl shadow-black/10"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-gold-400/30 shadow-lg">
                    <Image
                      src={coach.image}
                      alt={coach.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-semibold text-[#0b0b0b] mb-2">{coach.name}</p>
                  <p className="text-base text-gold-700 mb-4">{coach.title}</p>
                  <p className="text-sm text-[#4a4a4a] leading-relaxed">{coach.bio}</p>
                  <div className="mt-6 pt-6 border-t border-[#0b0b0b]/10">
                    <h4 className="text-base font-semibold text-[#0b0b0b] mb-3">Psikoloji ve Destek</h4>
                    <p className="text-sm text-[#4a4a4a]">
                      Metodun önemli bir kısmı psikolojik hazırlıktır. Öğrenciler duyguları yönetmeyi, konsantrasyonu korumayı ve turnuvalarda, kontrollerde ve sınavlarda kendilerini güvenli hissetmeyi öğrenirler. Her öğrenci bireysel bir plan alır: bazıları ciddi spor sonuçlarına gider, bazıları zevk ve düşünme gelişimi için çalışır. Amaç aynıdır — potansiyeli açığa çıkarmaya ve satrancı sevdirmeye yardımcı olmak.
                    </p>
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

