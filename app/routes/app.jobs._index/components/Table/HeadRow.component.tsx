export default function HeadRow() {
  return (
    <thead>
      <tr className="border-b border-border">
        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
          Task Name
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
          Status
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
          Saving of Alt Texts
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
          Created
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
          Processed
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
          Completed
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
          Alt Texts Generated
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
          Duration
        </th>
      </tr>
    </thead>
  );
}
