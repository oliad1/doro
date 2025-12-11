import {
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationFooterProps {
  hasNextPage: boolean;
  page: number;
  incrementPage: () => void;
  decrementPage: () => void;
  resetPage: () => void;
}

export default function PaginationFooter({
  hasNextPage,
  page,
  incrementPage,
  decrementPage,
  resetPage,
}: PaginationFooterProps) {
  return (
    <PaginationContent className="w-full flex flex-row justify-center items-center py-5 h-min">
      {page > 1 && (
        <>
          <PaginationItem>
            <PaginationPrevious
              style={{ userSelect: "none" }}
              onClick={decrementPage}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink style={{ userSelect: "none" }} onClick={resetPage}>
              1
            </PaginationLink>
          </PaginationItem>

          {page > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
        </>
      )}

      <PaginationItem>
        <PaginationLink style={{ userSelect: "none" }} isActive>
          {page}
        </PaginationLink>
      </PaginationItem>

      {hasNextPage && (
        <>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              style={{ userSelect: "none" }}
              onClick={incrementPage}
            />
          </PaginationItem>
        </>
      )}
    </PaginationContent>
  );
}
