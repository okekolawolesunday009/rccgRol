interface SectionHeaderProps {
  label: string;
  title: string;
  titleItalic?: string;
  description?: string;
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  titleItalic,
  description,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <span className="text-amber-500 font-label text-sm tracking-[0.3em] uppercase mb-4 block">
        {label}
      </span>
      <h2 className="font-headline text-5xl text-white leading-tight mb-6">
        {title}
        {titleItalic && (
          <>
            {' '}
            <span className="italic">{titleItalic}</span>
          </>
        )}
      </h2>
      {description && (
        <p className="text-slate-300 font-body text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
