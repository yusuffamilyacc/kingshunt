import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";

// Disable caching for dynamic data
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Program {
  id: string;
  title: string;
  description: string;
  level: string | null;
  duration: string | null;
  price: string | null;
  structure: string[];
  goals: string[];
}

// Default images for programs
const defaultImages = [
  "/images/program-1.png",
  "/images/program-2.png",
  "/images/program-3.png",
  "/images/program-4.png",
  "/images/program-5.png",
  "/images/program-6.png",
];

async function getPrograms(): Promise<Program[]> {
  try {
    // In server components, we can use relative URLs or direct Prisma access
    // Using Prisma directly is more efficient for server components
    const { prisma } = await import("@/lib/prisma");
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: "desc" },
    });
    return programs;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
}

export default async function ProgramsPage() {
  const programs = await getPrograms();
  return (
    <div className="text-[#0b0b0b]">
      <section className="relative overflow-hidden border-b border-[#0b0b0b]/5 bg-gradient-to-b from-white via-[#f4ecde] to-[#f7f4ec]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(201,162,77,0.12),transparent_32%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-12">
          <SectionHeading
            align="center"
            eyebrow="Programlar"
            title="Eğitim Programları"
            subtitle="Her seviye için kendi programı, temposu ve vurguları. Ücretsiz deneme dersi ile başlayabilirsiniz."
          />
        </div>
      </section>

      <section className="mx-auto w-full px-4 py-16 md:px-6 md:py-12">
        {programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4a4a4a]">Henüz program eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {programs.map((program, index) => {
              // Use default image or a placeholder
              const imageUrl = defaultImages[index % defaultImages.length];
              
              return (
                <div
                  key={program.id}
                  className="group rounded-3xl border border-[#0b0b0b]/6 bg-white overflow-hidden shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                    {program.price && (
                      <div className="absolute top-4 right-4 rounded-full border border-white/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-[#0b0b0b] shadow-sm backdrop-blur-md">
                        {program.price}
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-gold-300 font-medium">
                        {program.level ? program.level : "Program"}
                      </p>
                      <h2 className="text-xl font-bold text-white mt-1.5 line-clamp-2">
                        {program.title}
                      </h2>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-sm text-[#4a4a4a] mb-4 line-clamp-3 flex-1">
                      {program.description}
                    </p>
                    {(program.structure.length > 0 || program.goals.length > 0) && (
                      <div className="mt-auto space-y-4">
                        {program.structure.length > 0 && (
                          <div className="rounded-xl border border-[#0b0b0b]/5 bg-[#f7f4ec] p-4">
                            <p className="text-xs font-semibold text-gold-700 mb-2">
                              Haftalık Yapı
                            </p>
                            <ul className="space-y-1.5 text-xs text-[#4a4a4a]">
                              {program.structure.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                                  <span className="line-clamp-1">{item}</span>
                                </li>
                              ))}
                              {program.structure.length > 3 && (
                                <li className="text-xs text-gold-600 font-medium pl-3.5">
                                  +{program.structure.length - 3} daha fazla
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {program.goals.length > 0 && (
                          <div className="rounded-xl border border-[#0b0b0b]/5 bg-[#f7f4ec] p-4">
                            <p className="text-xs font-semibold text-gold-700 mb-2">Hedefler</p>
                            <ul className="space-y-1.5 text-xs text-[#4a4a4a]">
                              {program.goals.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                                  <span className="line-clamp-1">{item}</span>
                                </li>
                              ))}
                              {program.goals.length > 3 && (
                                <li className="text-xs text-gold-600 font-medium pl-3.5">
                                  +{program.goals.length - 3} daha fazla
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

