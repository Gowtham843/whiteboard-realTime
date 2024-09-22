"use client"; // This is a Next.js-specific directive that ensures the file is treated as a client-side component.

import { ReactNode } from "react"; // Importing ReactNode, which is a type used to define React component children.
import {
  LiveblocksProvider,     // LiveblocksProvider is used to provide the Liveblocks client to the entire app.
  RoomProvider,           // RoomProvider is used to manage the state of a specific room in Liveblocks.
  ClientSideSuspense,     // ClientSideSuspense allows for suspense behavior during rendering (for async components).
} from "@liveblocks/react/suspense";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { Layer } from "@/types/canavas";

// This functional component, `Room`, wraps its children with the necessary Liveblocks context.
// Props:
// - children: ReactNode that represents the child components to be rendered within this room context.
// - roomId: The unique identifier for the room being connected to Liveblocks.
// - fallback: The fallback component to render while the room data is loading (non-nullable ReactNode).
export function Room({ children, roomId, fallback }: { children: ReactNode, roomId: string, fallback: NonNullable<ReactNode> | null }) {
  return (
    // LiveblocksProvider sets up the Liveblocks environment and provides access to Liveblocks features.
    // authEndpoint is the API endpoint that authenticates the user in Liveblocks.
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={16} >

      {/* RoomProvider manages the state and presence of the users inside the room.
          - id: The room ID passed as a prop.
          - initialPresence: Initial user state when they join the room (here, the user's cursor starts as null). */}
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null, // Initial cursor state is set to `null`.
          selection: [],
          pencilDraft: null,
          penColor: null
        }}
        initialStorage={{
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList([]),
        }}

      >

        {/* ClientSideSuspense ensures that the children are rendered only after all required data is loaded.
            - fallback: The fallback UI to display while waiting for the children to be ready. */}
        <ClientSideSuspense fallback={fallback}>
          {children} {/* The components passed as `children` are rendered once data is fully available */}
        </ClientSideSuspense>

      </RoomProvider>
    </LiveblocksProvider>
  );
}
