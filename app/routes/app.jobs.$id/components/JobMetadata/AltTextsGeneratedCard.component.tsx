type AltTextsGeneratedCardParams = {
  totalGeneratedAltTexts: number;
};

export default function AltTextsGeneratedCard({
  totalGeneratedAltTexts,
}: AltTextsGeneratedCardParams) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Alt Texts Generated
        </h3>
      </div>
      <div className="text-3xl font-bold text-foreground">
        {totalGeneratedAltTexts}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Image alt texts</p>
    </div>
  );
}
