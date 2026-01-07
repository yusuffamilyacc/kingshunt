 type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  const alignment =
    align === "center"
      ? "text-center items-center"
      : "text-left items-start";

  return (
    <div className={`flex w-full flex-col gap-2 ${alignment}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-semibold text-[#0b0b0b] md:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-sm text-[#3f3f3f] md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

