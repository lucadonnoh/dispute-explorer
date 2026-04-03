export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-0.5 ${className}`}
    >
      {children}
      <svg width="10" height="10" viewBox="0 0 12 12" className="opacity-40 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 1h7v7M11 1L4.5 7.5" />
      </svg>
    </a>
  );
}
