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

export default function DeleteUserDialog({
  open,
  onOpenChange,
  onDelete,
  userName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
  userName: string;
}) {
  const handleDelete = () => {
    if (onDelete) onDelete(); // perform delete action
    onOpenChange(false); // close dialog
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure want to delete this user?</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting {userName ? `"${userName}"` : 'this user'} is permanent and cannot be undone.
            Please confirm that you want to proceed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
