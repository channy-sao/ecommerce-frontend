import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";

export default function  DetailProductDialog ({open, onOpenChange}: {open: boolean, onOpenChange: (open: boolean)=> void}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {/*<AlertDialogTrigger asChild>*/}
            {/*    <Button variant="outline">Show Dialog</Button>*/}
            {/*</AlertDialogTrigger>*/}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Product Detail</AlertDialogTitle>
                    <AlertDialogDescription>
                        This feature is not implemented yet.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}