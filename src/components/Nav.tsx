"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/applications", label: "Applications" },
  { href: "/add", label: "+ Add" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-paper">
      <nav aria-label="Main" className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
          The Job Ledger
        </Link>
        <ul className="flex gap-1 text-sm">
          {LINKS.map(({ href, label }) => {
            const current = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={current ? "page" : undefined}
                  className={`rounded px-3 py-2 underline-offset-4 hover:underline ${
                    current ? "font-semibold text-accent underline decoration-2" : "text-muted"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
