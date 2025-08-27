import { AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const DELETE_COURSE_HEADER = () => {
  return <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
	This action cannot be undone. This will permanently delete the grades related to this course.
      </AlertDialogDescription>
    </AlertDialogHeader>
};

export const CHANGE_COURSE_HEADER = () => {
  return <DialogHeader>
    <DialogTitle>Due Date</DialogTitle>
    <DialogDescription>
      Change the due date of your assessment.
    </DialogDescription>
  </DialogHeader>
};
