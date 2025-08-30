import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerClose, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { ChevronDown, FilterX } from 'lucide-react';
import { DEPARTMENTS, FACULTIES, TERMS } from '@/constants/SearchConstants';
import { getTermName } from "@/utils/helpers";

interface FilterProps {
  facIndex: number | undefined,
  dept: string,
  searchTerm?: string,
  clearFilters: () => void,
  onFacChange: (i: number) => void,
  onDeptChange: (dept: string) => void,
  onTermChange?: (searchTerm: string) => void,
}

export default function Filter ({ facIndex, dept, searchTerm, clearFilters, onFacChange, onDeptChange, onTermChange }: FilterProps) {
  return (
    <div className="flex flex-row gap-2 self-end">
      <Drawer>
	<DrawerTrigger asChild>
	  <Button variant="ghost" className="sm:hidden">
	    Filters
	    <ChevronDown/>
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
	      clearFilters={clearFilters}
	      onFacChange={onFacChange}
	      onDeptChange={onDeptChange}
	      onTermChange={onTermChange}
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
	      clearFilters={clearFilters}
	      onFacChange={onFacChange}
	      onDeptChange={onDeptChange}
	      onTermChange={onTermChange}
	    />
	  </div>
	  <Button onClick={clearFilters}>
	    <FilterX/>
	  </Button>
	</div>
      </Drawer>
    </div>
  );
};

function ResponsiveFilters ({ facIndex, dept, searchTerm, onFacChange, onDeptChange, onTermChange }: FilterProps) {
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
	  <DropdownMenuRadioGroup value={validFaculty ? FACULTIES[facIndex!] : ""}>
	    {FACULTIES.map((facultyOption, i) => (
	      <DropdownMenuRadioItem
		key={facultyOption}
		value={facultyOption}
		onSelect={()=>onFacChange(i)}>
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
	    {[...(validFaculty ? DEPARTMENTS[facIndex!] : DEPARTMENTS.flat())].map((departmentOption) => (
	      <DropdownMenuRadioItem 
		key={departmentOption} 
		value={departmentOption}
		onSelect={()=>onDeptChange(departmentOption)}>
		{departmentOption}
	      </DropdownMenuRadioItem>
	    ))}
	  </DropdownMenuRadioGroup>
	</DropdownMenuContent>
      </DropdownMenu>
      
      {(searchTerm) && (
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
		  onSelect={()=>onTermChange!(termOption.toString())}>
		  {getTermName(termOption.toString())}
		</DropdownMenuRadioItem>
	      ))}
	    </DropdownMenuRadioGroup>
	  </DropdownMenuContent>
	</DropdownMenu>
      )}
    </div>
  );
};
