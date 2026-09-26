import Link from "next/link";

/**
 * Floats to the left of the column on wide screens, sits inline above the
 * content on narrow ones.
 */
export function BackLink({
  href = "/",
  label = "Home",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="group mb-8 inline-flex items-center gap-1 text-muted transition-colors hover:text-fg xl:fixed xl:top-16 xl:left-10 xl:mb-0"
    >
      <span className="transition-transform group-hover:-translate-x-0.5">
        &lsaquo;
      </span>
      {label}
    </Link>
  );
}
