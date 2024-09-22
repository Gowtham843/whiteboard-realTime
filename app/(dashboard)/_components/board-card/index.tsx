"use client";

import Image from "next/image";
import Link from "next/link";
import { Overlay } from "./overlay";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { BoardFooter } from "./Boardfooter";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/actions";
import { MoreHorizontal } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface BoardCardProps {
    id: string;
    title: string;
    authorId: string;
    authorName: string;
    createdAt: number;
    imageUrl: string;
    orgId: string;
    isFavorite: boolean;

}

export const BoardCard = ({
    id,
    title,
    authorId,
    authorName,
    createdAt,
    imageUrl,
    orgId,
    isFavorite
}: BoardCardProps) => {

    const { userId } = useAuth();
    const {
        mutate: onFavorite,
        pending: pendingFavorite
    } = useApiMutation(api.board.favorite);

    const {
        mutate: onUnfavorite,
        pending: pendingUnfavorite
    } = useApiMutation(api.board.unfavorite)

    const authorLabel = userId === authorId ? "You" : authorName
    const createdAtLabel = formatDistanceToNow(createdAt, {
        addSuffix: true
    })


    const toggleFavorite = () => {
        if (isFavorite) {
            onUnfavorite({ id })
                .then(() => toast.success("Board is unFavorite"))
                .catch(() => toast.error("Failed to select as unFavorite"))
        } else {
            onFavorite({ id, orgId })
                .then(() => toast.success("Board is selected as Favorite..!"))
                .catch(() => toast.error("Failed to select as Favorite"))
        }

    }


    return (
        <Link href={`/board/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-slate-100">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-fit"
                    />
                    <Overlay />
                    <Actions id={id}
                        title={title}
                        side="right"
                    >
                        <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
                            <MoreHorizontal className="text-white opacity-60 hover:opacity-100 transition-opacity"
                            />
                        </button>
                    </Actions>
                </div>
                <BoardFooter
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={toggleFavorite}
                    disabled={pendingFavorite || pendingUnfavorite}
                />
            </div>
        </Link>
    );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className="aspect-[100/127] rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full" />
        </div>
    )
}