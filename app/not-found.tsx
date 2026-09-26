import { Column } from "@/components/Column";
import { BackLink } from "@/components/BackLink";

export default function NotFound() {
  return (
    <Column>
      <BackLink />
      <h1 className="mb-2 text-[18px] font-medium">Not found</h1>
      <p className="text-muted">
        That page doesn&rsquo;t exist, or it did once and doesn&rsquo;t anymore.
      </p>
    </Column>
  );
}
