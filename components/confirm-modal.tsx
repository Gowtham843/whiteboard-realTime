import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"

interface confirmModelProps {
    children: React.ReactNode;
    onConfirm: () => void
    disabled?: boolean
    header: string
    description?: string;
}

export const ConfirmModel = ({
    children,
    onConfirm,
    disabled,
    header,
    description
}: confirmModelProps) => {

    const handleConfirm=()=>{
        onConfirm();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {header}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction type="submit" disabled={disabled} onClick={handleConfirm}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )


}