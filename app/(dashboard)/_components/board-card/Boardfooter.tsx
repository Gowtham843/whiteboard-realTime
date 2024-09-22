import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface BoardFooterProps {
    isFavorite: boolean;
    title: string;
    authorLabel: string;
    createdAtLabel: string;
    onClick: () => void;
    disabled: boolean;
}

export const BoardFooter = ({
    isFavorite,
    title,
    authorLabel,
    createdAtLabel,
    onClick,
    disabled,
}: BoardFooterProps) => {

    const handleClick=(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    )=>{
        event.stopPropagation();
        event.preventDefault();
        onClick();

    }

    return (
        <div className="relative bg-white p-3 group rounded-t-lg">

            <p className="text-[13px] font-semibold truncate max-w-[calc(100%-20px)]">
                {title}
            </p>
            <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 ease-in-out">
                <p className="text-[12px] truncate ">
                    <span className="font-medium">Created By :</span> {authorLabel}<br />
                    <span className="text-[11px]">{createdAtLabel}</span>
                </p>
            </div>
            <button disabled={disabled}
                onClick={handleClick}
                className={cn("opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 text-muted-foreground hover:text-orange-400",
                    disabled && "cursor-not-allowed opacity-75"
                )}>
                <Star
                    className={cn(
                        "h-4 w-4",
                        isFavorite && "fill-orange-400 text-orange-400"
                    )}
                />
            </button>
        </div>

    )
}