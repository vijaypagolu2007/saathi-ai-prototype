
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

type CrisisAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CrisisAlert({ open, onOpenChange }: CrisisAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center">
            It sounds like you're going through a lot
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            If you are in crisis or may be in danger, please contact a helpline
            for immediate support. Your safety is the most important thing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2 text-center">
          <p className="font-semibold">National Suicide Prevention Lifeline</p>
          <a
            href="tel:988"
            className="text-2xl font-bold tracking-wider text-primary hover:underline"
          >
            988
          </a>
          <p className="mt-2 font-semibold">Crisis Text Line</p>
          <p>
            Text HOME to <strong className="font-bold">741741</strong>
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction className="w-full">I Understand</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
