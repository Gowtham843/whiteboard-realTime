"use client";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Hint } from "./hint";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface NewBoardButtonProps {
    orgId: string;
    disabled?: boolean;
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
    const { mutate, pending } = useApiMutation(api.board.create);
    const router = useRouter();


    const onClick = () => {

        mutate({
            orgId: orgId,
            title: "Untitled"
        })
            .then((id) => {
                toast.success("Board Created!");
                router.push(`/board/${id}`);

            })
            .catch(() => toast.error("Failed to create new Board"))
    }
    return (
        <Hint label="Create New Board" side="top" align="center" sideOffset={8} alignOffset={0}>
            <button
                disabled={disabled}
                onClick={onClick}
                className={cn("z-50 fixed bottom-10 right-10 bg-blue-600 rounded-full hover:bg-blue-800 flex flex-col items-center justify-center p-2", (pending || disabled) && "opacity-50 hover:bg-muted-foreground cursor-not-allowed")}
            >
                <Plus className="h-10 w-10 text-white stroke-4 " />

            </button>
        </Hint>

    );
}
