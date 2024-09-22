import { v } from "convex/values"; // Import the `v` object from Convex, which helps validate arguments.
import { query } from "./_generated/server"; // Import the `query` function from Convex's generated server module.
import {getAllOrThrow} from 'convex-helpers/server/relationships'

export const get = query({
  // Define the structure of the arguments (input) for this query.
  // Expect `orgId` as a string and an optional `search` argument as a string.
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },

  // The handler is the function that will be executed when this query is called.
  handler: async (ctx, args) => {
    // Attempt to retrieve the identity of the user making the request.
    const identity = await ctx.auth.getUserIdentity();

    // If the user is not authenticated, throw an error.
    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (args.favorites) {
      const favoritedBoards = await ctx.db.query('userFavorites').withIndex('by_user_org', (q) => q
        .eq('userId', identity.subject)
        .eq('orgId', args.orgId)
      ).order("desc")
        .collect();

        const ids = favoritedBoards.map((b)=> b.boardId);
        const boards = await getAllOrThrow(ctx.db,ids);
        return boards.map((board)=>({
          ...board,
          isFavorite: true,
        }));

    }

    const title = args.search || ""; // Use the search string or default to an empty string if not provided.
    let boards = [];

    // If the search term (`title`) is provided, use the search index to filter boards by title.
    if (title) {
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q.search("title", title).eq("orgId", args.orgId)
        )
        .collect();
    } else {
      // Otherwise, query boards by organization ID using the `by_org` index.
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

    // Mapping through the list of boards to check if each one is favorited by the current user.
    const boardsWithFavoriteRelation = boards.map(async (board) => {
      const favorite = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", identity.subject).eq("boardId", board._id)
        )
        .unique();

      // Return the board object along with the `isFavorite` flag.
      return {
        ...board,
        isFavorite: !!favorite, // If `favorite` exists, `isFavorite` is true; otherwise, false.
      };
    });

    // Wait for all favorite checks to complete and return the final list of boards.
    const boardsWithFavoriteBoolean = await Promise.all(boardsWithFavoriteRelation);
    return boardsWithFavoriteBoolean;
  },
});
