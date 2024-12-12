import { FC } from "react";
import Link from "next/link";
import PaginationControlsProps from "@/data/paginationControlsProps";
import { Button } from "@nextui-org/react";

const PaginationControls: FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  queryParams,
}) => {
  console.log("pagination params", queryParams);

  return (
    <div className="pagination-controls flex justify-center items-center mt-10 mb-10 space-x-12">
      <Link href={`?${queryParams}&page=${currentPage - 1}`}>
        <Button
          disabled={currentPage === 1}
          color="primary"
          className={`px-4 py-2 ${currentPage === 1 ? "hidden" : ""}`}
        >
          Previous
        </Button>
      </Link>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Link href={`?${queryParams}&page=${currentPage + 1}`}>
        <Button
          disabled={currentPage === totalPages}
          color="primary"
          className={`px-4 py-2  ${currentPage === totalPages ? "hidden" : ""}`}
        >
          Next
        </Button>
      </Link>
    </div>
  );
};

export default PaginationControls;
