"use client";

import { FormEventHandler, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogClose, DialogHeader, DialogTitle } from "../ui/dialog";
import { UseRenameModal } from "@/store/use-rename-modal";  // Custom hook for modal state management
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";  // API to update board title
import { toast } from "sonner";  // Notification utility

export const Renamemodal = () => {
    const { mutate, pending } = useApiMutation(api.board.update)  // API mutation for updating board title

    const {
        isOpen,       // Tracks whether the modal is open
        onClose,      // Function to close the modal
        initalValues, // Initial values (like title and ID) passed to the modal
    } = UseRenameModal();

    const [title, settitle] = useState(initalValues.title);  // State to track the updated title
    
    // Ensure title is updated when modal opens with new initial values
    useEffect(() => {
        settitle(initalValues.title);  // Sync the title state with initial values when modal opens
    }, [initalValues.title]);

    // Handler for form submission to update board title
    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => { 
        e.preventDefault();
        mutate({ id: initalValues.id, title })  // Send API mutation to update board title
        .then(() => {
            toast.success("Successfully Renamed !!");  // Show success notification
            onClose();  // Close the dialog after successful mutation
        })
        .catch(() => {
            toast.error("Failed to rename board !!");  // Show error notification on failure
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}> {/* Open dialog when 'isOpen' is true */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit Board Title {/* Title of the modal */}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Enter a new title for this board {/* Description to guide the user */}
                </DialogDescription>
                <form onSubmit={onSubmit} className="space-y-4"> {/* Form for submitting the new title */}
                    <Input 
                        disabled={pending}   // Disable input while pending
                        required             // Make the input required
                        maxLength={60}       // Limit the title length to 60 characters
                        onChange={(e) => settitle(e.target.value)}  // Update title state on change
                        placeholder={initalValues.title}  // Placeholder shows current title
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant='outline'>
                                Cancel {/* Cancel button to close the modal */}
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant='primary' disabled={pending}> {/* Update button */}
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
