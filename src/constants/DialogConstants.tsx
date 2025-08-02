import { AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";

export const DELETE_COURSE_HEADER = () => {
  return <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
	This action cannot be undone. This will permanently delete the grades related to this course.
      </AlertDialogDescription>
    </AlertDialogHeader>
};
