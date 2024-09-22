// Client-side hook imports and Liveblocks mutation and self state.
import { useSelf } from "@liveblocks/react/suspense"; // Hook to access the current user's state.
import { useMutation } from "@liveblocks/react"; // Liveblocks mutation hook for modifying shared state.

/**
 * Custom hook to delete selected layers from the collaborative canvas.
 */
export const useDeleteLayers = () => {
    // Retrieve the current user's selected layers (from presence state).
    const selection = useSelf((me) => me.presence.selection);

    // Return a mutation function to delete the selected layers.
    return useMutation((
        { storage, setMyPresence }
    ) => {
        // Access the shared Liveblocks storage for layers and layer IDs.
        const liveLayers = storage.get('layers'); // Map of all layers.
        const liveLayerIds = storage.get('layerIds'); // Array of layer IDs.

        // Iterate through all selected layer IDs.
        for (const id of selection) {
            // Remove the layer from the 'layers' storage.
            liveLayers.delete(id);
            
            // Find the index of the layer ID in the 'layerIds' array.
            const index = liveLayerIds.indexOf(id);

            // If the ID exists, remove it from the 'layerIds' array.
            if (index !== -1) {
                liveLayerIds.delete(index); // Remove by index from 'layerIds'.
            }
        }

        // Clear the selection in the user's presence after deletion.
        setMyPresence({ selection: [] }, { addToHistory: true });
    }, [selection]); // Dependency array ensures this mutation reruns if the selection changes.
}
