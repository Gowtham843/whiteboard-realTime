"use client"

import { Hint } from "@/app/(dashboard)/_components/hint";
import { Actions } from "@/components/actions";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { UseRenameModal } from "@/store/use-rename-modal";
import { useQuery } from "convex/react";
import { Menu } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

interface InfoProps {
    boardId: string;
}

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

const TabSeparator = () => {
    return (
        <div className="text-neutral-300 px-1.5">|</div>
    )
}

const Info = ({ boardId }: InfoProps) => {

    const data = useQuery(api.board.get, {
        id: boardId as Id<'boards'>,
    });
    const { onOpen } = UseRenameModal();

    if (!data) {
        return <InfoSkeleton />
    }

    return (
        <div className="absolute top-2 left-2 rounded-md px-1.5 h-12 flex items-center shadow-lg">
            <Hint label="go back" side="bottom" sideOffset={10}>
                <Button variant='board' className="px-2" asChild>
                    <Link href='/'>
                        <Image
                            src='/logo.png'
                            alt="logo"
                            height={40}
                            width={40}
                        />
                        <span className={cn(
                            "font-semibold text-xl ml-2 text-black",
                            font.className
                        )}>
                            Fusion
                        </span>
                    </Link>
                </Button>
            </Hint>
            <TabSeparator />
            <Hint label="Edit title" side="bottom" sideOffset={10}>
                <Button
                    variant='board'
                    className="text-base font-normal px-2"
                    onClick={() => onOpen(data._id, data.title)}>
                    {data.title}
                </Button>
            </Hint>
            <TabSeparator />
            <Actions
                id={data._id}
                title={data.title}
                side="top"
                sideOffset={10}
            >
                <div>
                    <Button variant='board'>
                        <Menu />
                    </Button>
                </div>

            </Actions>
        </div>
    )
};

export default Info;

export const InfoSkeleton = () => {
    return (
        <div className="absolute top-2 left-2 rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px] opacity-75 animate-pulse" />
    )
}