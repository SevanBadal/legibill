import { FC } from "react";
import Link from "next/link";
import PaginationControlsProps from "@/data/paginationControlsProps";
import { Button } from "@nextui-org/react";

const PaginationControls: FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
}) => {
  return (
    <div className="pagination-controls flex justify-center items-center mt-10 mb-10 space-x-12">
      <Link href={`?page=${currentPage - 1}`}>
        <button
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md transition-colors ${
            currentPage === 1
              ? "hidden"
              : "bg-gray-900 text-gray-200 hover:bg-gray-400 hover:text-black"
          }`}
        >
          Previous
        </button>
      </Link>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Link href={`?page=${currentPage + 1}`}>
        <Button
          disabled={currentPage === totalPages}
          className={`px-4 py-2  ${currentPage === totalPages ? "hidden" : ""}`}
          color="primary"
        >
          Next
        </Button>
      </Link>
    </div>
  );
};

export default PaginationControls;
