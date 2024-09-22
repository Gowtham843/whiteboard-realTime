"use client";  // This indicates that this component will be run on the client side

import { Skeleton } from "@/components/ui/skeleton";  // Importing the Skeleton component for loading placeholders
import { UserAvatar } from "./user-avatar";  // Importing a custom UserAvatar component to display user avatars
import { useOthers, useSelf } from "@liveblocks/react/suspense";  // Importing hooks from Liveblocks to manage real-time user presence
import { connectionIdToColor } from "@/lib/utils";

// Maximum number of users to show before showing a "more users" indication
const MAX_SHOW_USERS = 2;

const Participants = () => {

    // `useOthers` retrieves the other participants in the session (excluding the current user)
    const users = useOthers();
    // `useSelf` retrieves the current user information (self)
    const currentUser = useSelf();

    // Check if there are more users than the maximum allowed to be displayed
    const hasMoreUsers = users.length > MAX_SHOW_USERS;

    return (
        // Container for displaying the participants
        <div className="absolute top-2 right-5 h-12 bg-white opacity-85 rounded-md p-3 flex items-center shadow-lg">
            <div className="flex gap-x-2">
                {/* Slice the users array to only display up to MAX_SHOW_USERS */}
                {users.slice(0, MAX_SHOW_USERS).map(({
                    connectionId,
                    info
                }) => {
                    return (
                        // Render each user's avatar with their picture or fallback if not available
                        <UserAvatar
                            key={connectionId}  // Unique key for each user (connectionId is used here)
                            src={info?.picture}  // Source of the user's profile picture
                            name={info?.name}  // The user's name (to display as a tooltip or fallback)
                            fallback={info?.name?.[0] || "T"}  // The first letter of the user's name, or "T" as default
                            borderColor={connectionIdToColor(connectionId)}
                        />
                    )
                })}

                {/* Render the current user's avatar if available */}
                {currentUser && (
                    <UserAvatar
                        src={currentUser.info?.picture}  // Current user's profile picture
                        name={`${currentUser.info?.name} (You)`}  // Display "You" for the current user
                        fallback={currentUser.info?.name?.[0]}  // The first letter of the current user's name as a fallback
                        borderColor={connectionIdToColor(currentUser.connectionId)}

                    />
                )}


                {/* when urser limite is extend the other user are show in  plus number format  */}
                {hasMoreUsers && (
                    <UserAvatar
                        name={`${users.length - MAX_SHOW_USERS} more`}
                        fallback={`+${users.length - MAX_SHOW_USERS}`}
                    />
                )}

            </div>
        </div>
    );
};

export default Participants;  // Exporting the Participants component as default

// This component renders a loading skeleton placeholder for when participants are loading
export const ParticipantsSkeleton = () => {
    return (
        // Placeholder container with styling for a loading state
        <div className="absolute top-2 right-5 h-12 bg-white rounded-md p-3 flex items-center shadow-md w-[100px] opacity-75" />
    );
};
