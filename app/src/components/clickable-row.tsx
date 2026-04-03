"use client";

import { useRouter } from "next/navigation";

export function ClickableRow({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  return (
    <tr
      className={`cursor-pointer ${className}`}
      onClick={(e) => {
        // Don't navigate if clicking an external link
        const target = e.target as HTMLElement;
        if (target.closest("a[target='_blank']")) return;
        router.push(href);
      }}
    >
      {children}
    </tr>
  );
}
