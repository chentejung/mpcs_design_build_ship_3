"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/applications", label: "Applications" },
  { href: "/add", label: "+ Add", cta: true },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-paper">
      <nav aria-label="Main" className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-5 py-4">
        <Link href="/" className="whitespace-nowrap font-serif text-lg font-semibold tracking-tight sm:text-xl">
          The Job Ledger
        </Link>
        <ul className="flex items-center text-sm sm:gap-1">
          {LINKS.map(({ href, label, cta }) => {
            const current = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={current ? "page" : undefined}
                  className={
                    cta
                      ? // The main action: a filled button, outlined in ink when you're on /add.
                        `ml-1 whitespace-nowrap rounded-md bg-accent px-3 py-2 font-semibold text-paper hover:bg-accent-ink ${
                          current ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""
                        }`
                      : `whitespace-nowrap rounded px-1.5 py-2 underline-offset-4 sm:px-3 hover:underline ${
                          current ? "font-semibold text-accent underline decoration-2" : "text-muted"
                        }`
                  }
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
