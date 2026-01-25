export default function SkeletonLoader() {
  return (
    // Loading state - skeleton rows
    Array.from({ length: 10 }).map((_, index) => (
      <tr
        key={`skeleton-${index}`}
        className={`border-b border-border/50 ${index % 2 === 0 ? "bg-background/50" : ""}`}
      >
        <td className="px-6 py-4">
          <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-8 w-24 animate-pulse rounded-lg bg-muted"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 w-12 animate-pulse rounded bg-muted"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
        </td>
      </tr>
    ))
  );
}
