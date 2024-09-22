import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CreateOrganization } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import Image from "next/image"


export const EmpytyOrg = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/logo.png"
                alt="Empty"
                height={200}
                width={200}
            />
            <h2 className="text-2xl font-semibold mt-6 ">Welcome to Fusion Board</h2>
            <p className="text-muted-foreground text-sm mt-2">Create an organixation to get Started</p>
            <div className="mt-6 ">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="lg" variant="primary">
                            <Plus className="h-5 w-5 mr-1" />
                            Create Organization 
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
                        <CreateOrganization />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}