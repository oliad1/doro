import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, FilterX, EyeOff, Eye } from "lucide-react";
import {
  DEPARTMENTS,
  FACULTIES,
  TERMS,
  TYPES,
} from "@/constants/SearchConstants";
import { getTermName } from "@/utils/helpers";

interface FilterProps {
  badgesVisible?: boolean;
  facIndex: number | undefined;
  dept: string;
  searchTerm?: string;
  courseTypes?: string[];
  clearFilters: () => void;
  onFacChange: (i: number) => void;
  onDeptChange: (dept: string) => void;
  onTermChange?: (searchTerm: string) => void;
  toggleChecked?: (key: string) => void;
  toggleVisible?: () => void;
}

export default function Filter({
  badgesVisible,
  facIndex,
  dept,
  searchTerm,
  courseTypes,
  clearFilters,
  onFacChange,
  onDeptChange,
  onTermChange,
  toggleChecked,
  toggleVisible,
}: FilterProps) {
  return (
    <div className="flex flex-row gap-2 self-end">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="sm:hidden">
            Filters
            <ChevronDown />
          </Button>
        </DrawerTrigger>
        <div className="flex flex-row self-start gap-2">
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>Filter your course search</DrawerDescription>
            </DrawerHeader>

            <ResponsiveFilters
              facIndex={facIndex}
              dept={dept}
              searchTerm={searchTerm}
              courseTypes={courseTypes}
              clearFilters={clearFilters}
              onFacChange={onFacChange}
              onDeptChange={onDeptChange}
              onTermChange={onTermChange}
              toggleChecked={toggleChecked}
            />

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="ghost">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>

          <div className="hidden sm:inline">
            <ResponsiveFilters
              facIndex={facIndex}
              dept={dept}
              searchTerm={searchTerm}
              courseTypes={courseTypes}
              clearFilters={clearFilters}
              onFacChange={onFacChange}
              onDeptChange={onDeptChange}
              onTermChange={onTermChange}
              toggleChecked={toggleChecked}
            />
          </div>
          {typeof badgesVisible == "boolean" && (
            <Tooltip>
              <TooltipContent>Hide Tags</TooltipContent>
              <TooltipTrigger asChild>
                <Button variant="secondary" onClick={toggleVisible}>
                  {badgesVisible ? <Eye /> : <EyeOff />}
                </Button>
              </TooltipTrigger>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipContent>Clear Filters</TooltipContent>
            <TooltipTrigger asChild>
              <Button onClick={clearFilters}>
                <FilterX />
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </div>
      </Drawer>
    </div>
  );
}

function ResponsiveFilters({
  facIndex,
  dept,
  searchTerm,
  courseTypes,
  onFacChange,
  onDeptChange,
  onTermChange,
  toggleChecked,
}: FilterProps) {
  const validFaculty = Number.isInteger(facIndex);

  return (
    <div className="self-start pl-4 sm:pl-0 flex flex-wrap sm:flex-nowrap w-[90%] sm:w-min gap-2 text-left">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="faculty">
          <Button variant="outline">
            {validFaculty ? FACULTIES[facIndex!] : "Faculty"}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={validFaculty ? FACULTIES[facIndex!] : ""}
          >
            {FACULTIES.map((facultyOption, i) => (
              <DropdownMenuRadioItem
                key={facultyOption}
                value={facultyOption}
                onSelect={() => onFacChange(i)}
              >
                {facultyOption}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="department">
          <Button variant="outline">
            {dept}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={dept}>
            {[
              ...(validFaculty ? DEPARTMENTS[facIndex!] : DEPARTMENTS.flat()),
            ].map((departmentOption) => (
              <DropdownMenuRadioItem
                key={departmentOption}
                value={departmentOption}
                onSelect={() => onDeptChange(departmentOption)}
              >
                {departmentOption}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {searchTerm && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {getTermName(searchTerm) || "Term"}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={searchTerm}>
              {TERMS.map((termOption) => (
                <DropdownMenuRadioItem
                  key={termOption}
                  value={termOption.toString()}
                  onSelect={() => onTermChange!(termOption.toString())}
                >
                  {getTermName(termOption.toString())}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {courseTypes && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Type
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {TYPES.map((typeOption) => (
              <DropdownMenuCheckboxItem
                key={typeOption}
                checked={courseTypes!.some((item) => item == typeOption)}
                onCheckedChange={() => toggleChecked!(typeOption)}
              >
                {typeOption}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
