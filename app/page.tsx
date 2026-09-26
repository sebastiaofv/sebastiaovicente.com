import Link from "next/link";
import { Column } from "@/components/Column";
import { PhotoStrip } from "@/components/PhotoStrip";
import { site } from "@/site.config";

export default function Home() {
  return (
    <Column className="prose">
      <h1 className="mb-5 text-[18px] font-medium">{site.name}</h1>

      {/* ---- Intro ------------------------------------------------------ */}
      <p>
        I&rsquo;m a quantitative developer at{" "}
        <a href="https://www.bportugal.pt/en" target="_blank" rel="noreferrer">
          Banco de Portugal
        </a>
        . I work on models, data systems, and the infrastructure behind them. Mostly finance, forecasting, risk, and the less visible parts that make the rest hold up.
      </p>

      <p>
        I care about invariants, simple interfaces, and code that holds up under scrutiny.
      </p>

      <p>
        I occasionally write.{" "}
        <Link href="/blog" className="text-muted">
          Read the blog &rsaquo;
        </Link>
      </p>

      {/* ---- Contact ---------------------------------------------------- */}
      <h2 className="mt-10 mb-3 text-[18px] font-medium">Contact</h2>

      <p>
        Reach me at <a href="https://www.linkedin.com/in/sebastiaovicente/">/in/sebastiaovicente/</a> or <a href={`mailto:${site.email}`}>{site.email}</a> :)
      </p>

      {/* ---- Photos ----------------------------------------------------- */}
      <h2 className="mt-10 mb-3 text-[18px] font-medium">Sketchbook</h2>
      <PhotoStrip />
    </Column>
  );
}
