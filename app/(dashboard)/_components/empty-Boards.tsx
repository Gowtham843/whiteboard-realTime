"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const EmptyBoards = () => {
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.board.create);
  const router = useRouter();


  const onClick = () => {
    if (!organization) return;

    mutate({
      orgId: organization.id,
      title: "Untitled"
    })
      .then((id) => {
        toast.success("Board Created!");
        router.push(`/board/${id}`);
      })
      .catch(() => toast.error("Failed to create new Board"))
  }
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/empty-Boards.gif"  // Replace with the correct path to your GIF
        height={110}
        width={110}
        alt="Empty"
      />
      <h2 className="text-2xl font-semibold mt-2">Create Your first Board</h2>
      <p className="text-muted-foreground text-sm mt-2">Start by creating a board for your Organization </p>
      <div className="mt-6">
        <Button disabled={pending} onClick={onClick} size='lg' variant='default'>
          <Plus className="h-5 w-5 mr-1 " />
          Create Board
        </Button>
      </div>
    </div>
  );
};
