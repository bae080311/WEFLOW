import { Card } from "@/shared/ui";
import { PRICING_NOTES, PRICING_VAT_NOTE } from "../config/notes";

export function PricingNotes() {
  return (
    <Card className="flex flex-col gap-3">
      <p className="text-body font-medium text-text">{PRICING_VAT_NOTE}</p>
      <ul className="flex flex-col gap-2">
        {PRICING_NOTES.map((note) => (
          <li key={note} className="text-caption text-text-muted">
            · {note}
          </li>
        ))}
      </ul>
    </Card>
  );
}
