export default function EmptyTable() {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <svg
            className="h-12 w-12 text-muted-foreground/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-muted-foreground">No jobs found</p>
        </div>
      </td>
    </tr>
  );
}
