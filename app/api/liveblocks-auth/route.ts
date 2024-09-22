import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";


const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
const liveblocks = new Liveblocks({
    secret: "sk_dev_iQTdZKv7fRsYZtjn6-p8aNetJA4H6i5ZiJF7Iyp5LsWTpMbtz5x2Mvzq6dhkhVzx",
});

export async function POST(request: Request) {
    // Get the current user from your database
    const authorization = await auth();
    const user = await currentUser();

    if (!authorization || !auth) {
        return new Response("Unauthorized", { status: 403 });
    }

    const { room } = await request.json();
    const board = await convex.query(api.board.get, { id: room });



    if (board?.orgId !== authorization.orgId) {
        return new Response("Forbidden", { status: 403 });
    }

    const userInfo = {
        name: user?.firstName || "Teammate",
        picture: user?.imageUrl
    };

    const session = liveblocks.prepareSession(
        user?.id ?? 'defaultUserId',
        { userInfo }
    );

    if(room){
        session.allow(room,session.FULL_ACCESS);
    }

    
    
    const { status, body } = await session.authorize();
    return new Response(body, { status });

}