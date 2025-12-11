"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Minus,
  ExternalLink,
  CircleDot,
  EyeOff,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pagination } from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import PaginationFooter from "@/components/Pagination/Pagination";
import Filter from "@/components/Search/Filters";
import { SearchParams } from "@/constants/SearchConstants";
import { DELETE_COURSE_HEADER } from "@/constants/DialogConstants";
import { OUTLINE_PAGE, UW_FLOW_PAGE } from "@/constants/Routes";
import { SEARCH_RESULTS } from "@/constants/SkeletonConstants";
import { getSearchParams, getTermName } from "@/utils/helpers";
import { CourseDTO } from "@/types/Types";
import { useDashboardStore } from "@/providers/dashboard-store-provider";
import OutlinesAPIClient from "@/APIClients/OutlinesAPIClient";

export default function SearchPage(searchParams: Promise<SearchParams>) {
  const router = useRouter();

  const { termCourses, addTermCourse, deleteTermCourse, term } =
    useDashboardStore((state) => state);

  const [facultyIndex, setFacultyIndex] = useState<number>();
  const [dept, setDept] = useState("Department");
  const [searchTerm, setSearchTerm] = useState("Term");
  const [courseTypes, setCourseTypes] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [badgesVisible, setBadgesVisible] = useState(true);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<CourseDTO[] | null>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const validFaculty = Number.isInteger(facultyIndex);

  useEffect(() => {
    router.push(
      getSearchParams({
        page: page.toString(),
        ...(validFaculty && { fac: facultyIndex!.toString() }),
        dept: dept,
        search: search,
        term: searchTerm,
        types: courseTypes,
      }),
    );
  }, [facultyIndex, dept, page, search, searchTerm, courseTypes, router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handlePress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    if (value === "Enter") {
      setSearch(query);
      setPage(1);
    }
  };

  const handlePageChange = (value: number) => {
    setLoading(true);
    setPage(value);
  };

  const clearFilters = () => {
    setFacultyIndex(NaN);
    setDept("Department");
    setSearch("");
    setSearchTerm("Term");
    setCourseTypes([]);
    setPage(1);
  };

  const onFilterChange = (func: () => void) => {
    setLoading(true);
    setPage(1);
    setSearch(query);
    func();
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);

      const { searchParams } = new URL(window.location.href);

      if (searchParams.has("page")) {
        let pageVal = Number.parseInt(searchParams.get("page")!)!;
        setPage(pageVal > 0 ? pageVal : 1);
      }
      if (searchParams.has("search")) {
        setQuery(searchParams.get("search")!);
      }
      if (searchParams.has("fac")) {
        setFacultyIndex(Number.parseInt(searchParams.get("fac")!));
      }
      if (searchParams.has("dept")) {
        setDept(searchParams.get("dept")!);
      }
      if (searchParams.has("term")) {
        setSearchTerm(searchParams.get("term")!);
      }
      if (searchParams.has("types")) {
        const filterList = searchParams.get("types")!.split(",");
        if (filterList.length != courseTypes.length) {
          setCourseTypes(filterList);
        }
      }

      const { data, hasNextPage } = (await OutlinesAPIClient.searchCourses(
        window.location.search,
        true,
      )) || { data: null, hasNextPage: false };

      setHasNextPage(hasNextPage);
      setResults(data!);
      setLoading(false);
    };
    fetchCourses();
  }, [searchParams]);

  return (
    <Pagination className="no-scrollbar">
      <div className="w-full mx-4">
        <div className="sticky top-0 bg-[var(--background)] z-50 opacity-100 py-3 flex flex-col lg:flex-row items-center justify-center gap-2">
          <Input
            value={query.toUpperCase()}
            onChange={handleSearch}
            onKeyDown={handlePress}
            placeholder="Search"
            leadingIcon={<Search className="h-4" />}
          />
          <Filter
            badgesVisible={badgesVisible}
            facIndex={facultyIndex}
            dept={dept}
            searchTerm={searchTerm}
            courseTypes={courseTypes}
            clearFilters={clearFilters}
            toggleVisible={() => {
              setBadgesVisible(!badgesVisible);
            }}
            onFacChange={(i: number) => {
              onFilterChange(() => {
                if (i == facultyIndex) {
                  setFacultyIndex(undefined);
                } else {
                  setFacultyIndex(i);
                }
                if (dept != "Department") {
                  setDept("Department");
                }
              });
            }}
            onDeptChange={(selectedDept: string) => {
              onFilterChange(() => {
                if (dept == selectedDept) {
                  setDept("Department");
                } else {
                  setDept(selectedDept);
                }
              });
            }}
            onTermChange={(selectedTerm: string) => {
              onFilterChange(() => {
                if (selectedTerm == searchTerm) {
                  setSearchTerm("Term");
                } else {
                  setSearchTerm(selectedTerm);
                }
              });
            }}
            toggleChecked={(type: string) => {
              onFilterChange(() => {
                setCourseTypes(
                  courseTypes.some((item) => item == type)
                    ? courseTypes.filter((item) => item != type)
                    : [...courseTypes, type],
                );
              });
            }}
          />
        </div>

        <div ref={resultsRef} className="max-h-[80vh]">
          {isLoading ? (
            <SEARCH_RESULTS />
          ) : (
            <Accordion type="multiple" className="w-full">
              {!results || !results[0] ? (
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  No results.
                </p>
              ) : (
                results.map((result, i) => {
                  const courseEnrolled = termCourses.some(
                    (course) => course.c_id == result.id,
                  );
                  return (
                    <AlertDialog key={i}>
                      <AccordionItem
                        value={i.toString()}
                        className="border rounded-md mb-3 overflow-hidden hover:bg-card/80 py-0 pr-4 sm:w-full"
                      >
                        <div
                          data-course={i.toString()}
                          className="flex items-center space-x-4 w-[-webkit-fill-available]"
                        >
                          <AccordionTrigger className="pl-4">
                            <div className="flex-1 space-y-1 flex-col self-start items-start justify-start">
                              <div className="flex flex-row flex-wrap gap-2 py-0 items-center max-w-[39vw]">
                                <p className="text-sm font-medium leading-none w-max">
                                  {result.code}
                                </p>
                                {/*<div className="flex flex-row gap-2 flex-wrap">*/}
                                {result.term &&
                                  searchTerm == "Term" &&
                                  badgesVisible && (
                                    <Badge
                                      variant="secondary"
                                      className="h-[14px] rounded-full text-[10.5px] py-0 my-0"
                                    >
                                      {getTermName(result.term.toString())}
                                    </Badge>
                                  )}
                                {badgesVisible &&
                                  result.types.map((type, i) => (
                                    <Badge
                                      key={i}
                                      variant="secondary"
                                      className="h-[14px] rounded-full text-[10.5px] py-0 my-0"
                                    >
                                      {type.type}
                                    </Badge>
                                  ))}
                                {/*</div>*/}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {result.name}
                              </p>
                            </div>
                          </AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <a
                                href={
                                  UW_FLOW_PAGE +
                                  result.code
                                    .split("/")[0]
                                    .toLowerCase()
                                    .replaceAll(" ", "")
                                }
                                target="_blank"
                              >
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="p-0 size-8"
                                  >
                                    <CircleDot />
                                  </Button>
                                </TooltipTrigger>
                              </a>
                              <TooltipContent>UW Flow</TooltipContent>
                            </Tooltip>
                            {result.url && (
                              <Button variant="ghost" className="p-0 size-8">
                                <a
                                  href={OUTLINE_PAGE + result.url}
                                  target="_blank"
                                >
                                  <ExternalLink />
                                </a>
                              </Button>
                            )}
                            {courseEnrolled ? (
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="p-0 size-8">
                                  <Minus className="size-4" />
                                </Button>
                              </AlertDialogTrigger>
                            ) : (
                              <Button
                                variant="ghost"
                                className="p-0 size-8"
                                onClick={async () => {
                                  await addTermCourse({
                                    id: result.id,
                                    code: result.code,
                                    verified: true,
                                    c_id: result.id,
                                    ...(result.url && { url: result.url! }),
                                  });
                                  toast.success(
                                    `Added ${result.code} to ${term}`,
                                    {
                                      richColors: true,
                                    },
                                  );
                                }}
                              >
                                <Plus className="size-4" />
                              </Button>
                            )}
                            <AlertDialogContent>
                              <DELETE_COURSE_HEADER />
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={async () => {
                                    await deleteTermCourse(
                                      termCourses.find(
                                        (item) => item.code == result.code,
                                      )!.id,
                                    );
                                    toast.info(
                                      `Removed ${result.code} from ${term}`,
                                      {
                                        richColors: true,
                                      },
                                    );
                                  }}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </div>
                        </div>
                        <AccordionContent>
                          <div className="px-4 pb-0">
                            <p className="text-sm text-muted-foreground">
                              {result.description ?? "No description provided"}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </AlertDialog>
                  );
                })
              )}
            </Accordion>
          )}

          <PaginationFooter
            page={page}
            incrementPage={() => handlePageChange(page + 1)}
            decrementPage={() => handlePageChange(page - 1)}
            resetPage={() => handlePageChange(1)}
            hasNextPage={hasNextPage}
          />
        </div>
      </div>
    </Pagination>
  );
}
