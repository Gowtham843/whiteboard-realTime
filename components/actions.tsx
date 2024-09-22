"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Edit2, Link2, Trash, Trash2, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { ConfirmModel } from "./confirm-modal";
import { Button } from "./ui/button";
import { UseRenameModal } from "@/store/use-rename-modal";
import Link from "next/link";


interface ActionsProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps["side"];
    sideOffset?: DropdownMenuContentProps["sideOffset"];
    id: string;
    title: string;
}

export const Actions = ({
    children,
    side,
    sideOffset,
    id,
    title
}: ActionsProps) => {
    const { onOpen } = UseRenameModal();
    const { mutate, pending } = useApiMutation(api.board.remove)

    const onCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/board/${id}`)
            .then(() => {
                toast.success("Copied !");
            })
            .catch(() => toast.error("Failed to Copy"));
    };

    const onDelete = () => {

        mutate({ id })
            .then(() => toast.success("Board deleted !!"))
            .catch(() => toast.success("Failed to delete board !!"))

    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side={side || "right"}  // Ensure the dropdown is aligned to the right
                align="end"  // Ensure the dropdown aligns to the end of the trigger
                sideOffset={sideOffset || 10}  // Adjust the side offset to avoid viewport overflow
                className="w-60"  // Control the dropdown width
                onClick={(e) => e.stopPropagation()}
            >
                <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => onOpen(id, title)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Rename title
                </DropdownMenuItem>
                <ConfirmModel
                    header="Delete Confirm ??"
                    description="This will delete the Board and all of its content"
                    disabled={pending}
                    onConfirm={onDelete}
                >
                    
                        <Button className="p-3 cursor-pointer text-sm w-full justify-start font-normal" variant="ghost">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    
                </ConfirmModel>
                <DropdownMenuItem className="p-3 cursor-pointer" onClick={onCopyLink}>
                    <Link2 className="h-4 w-4 mr-2" />
                    Copy Board link
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
