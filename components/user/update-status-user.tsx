import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function UpdateStatusUser({
  open,
  onOpenChange,
  onTrigger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTrigger?: () => void;
}) {
  const handleStatusChange = () => {
    if (onTrigger) onTrigger(); // perform delete action
    onOpenChange(false); // close dialog
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure want to disable this user?</AlertDialogTitle>
          <AlertDialogDescription>Please confirm that you want to proceed.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleStatusChange} variant = {'custom'}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
