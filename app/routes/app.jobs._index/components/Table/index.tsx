import { useLocation, useNavigation } from "react-router";
import { $Enums } from "@prisma/client";
import HeadRow from "./HeadRow.component";
import SkeletonLoader from "./SkeletonLoader.component";
import EmptyTable from "./EmptyTable.component";
import TableBody from "./TableBody.component";

type TableParams = {
  jobs: {
    id: string;
    status: $Enums.JobStatus;
    createdAt: Date;
    processedOn: Date | null;
    finishedOn: Date | null;
    _count: {
      generatedAltTexts: number;
    };
  }[];
};

export default function Table({ jobs }: TableParams) {
  const navigation = useNavigation();
  const location = useLocation();
  const isChangingParams =
    navigation.state !== "idle" &&
    navigation.location.pathname === location.pathname;

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <HeadRow />
          <tbody>
            {isChangingParams ? (
              <SkeletonLoader />
            ) : jobs.length > 0 ? (
              <TableBody jobs={jobs} />
            ) : (
              <EmptyTable />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
