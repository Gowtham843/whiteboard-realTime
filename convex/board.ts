import { title } from "process";
import { mutation, query } from "./_generated/server"; // Importing 'mutation' from Convex to define mutations
import { v } from "convex/values"; // Importing 'v' to define argument types (validators for data types)

// An array of placeholder image URLs, used to assign a random image when creating a new board.
const images = [
    "/placeholder/1.svg",
    "/placeholder/2.svg",
    "/placeholder/3.svg",
    "/placeholder/4.svg",
    "/placeholder/5.svg",
    "/placeholder/6.svg",
    "/placeholder/7.svg",
    "/placeholder/8.svg",
    "/placeholder/9.svg",
    "/placeholder/10.svg"
];

// Mutation to create a new board
export const create = mutation({
    // Define the arguments this mutation takes
    args: {
        orgId: v.string(), // 'orgId' of the organization where the board is being created
        title: v.string(), // 'title' of the board to be created
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // Get the current user's identity

        // Check if the user is authenticated
        if (!identity) {
            throw new Error("Unauthorized"); // Throw an error if the user is not authenticated
        }

        // Randomly select an image from the 'images' array
        const randomImage = images[Math.floor(Math.random() * images.length)];

        // Insert a new board into the 'boards' table with the provided title, orgId, authorId, etc.
        const board = await ctx.db.insert("boards", {
            title: args.title,
            orgId: args.orgId,
            authorId: identity.subject, // The user's unique ID (from their identity)
            authorName: identity.name!, // The user's name
            imageUrl: randomImage // The randomly selected image URL
        });

        return board; // Return the newly created board
    }
});

// Mutation to delete a board
export const remove = mutation({
    // Define the argument for deleting a board
    args: { id: v.id("boards") }, // 'id' of the board to delete
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // Get the current user's identity

        // Check if the user is authenticated
        if (!identity) {
            throw new Error("Unauthorized"); // Throw an error if the user is not authenticated
        }

        const userId = identity.subject;
        const existingFavorite = await ctx.db.query('userFavorites')
            .withIndex('by_user_board',
                (q) =>
                    q
                        .eq('userId', userId)
                        .eq('boardId', args.id)

            ).unique()

        if (existingFavorite) {
            await ctx.db.delete(existingFavorite._id)
        }

        // Delete the board with the given 'id'
        await ctx.db.delete(args.id);
    },
});

// Mutation to update the title of a board
export const update = mutation({
    // Define the arguments for updating a board
    args: { id: v.id("boards"), title: v.string() }, // 'id' of the board to update and the new 'title'
    handler: async (ctx, args) => {
        const title = args.title.trim(); // Trim whitespace from the title
        const identity = await ctx.auth.getUserIdentity(); // Get the current user's identity

        // Validation checks
        if (!title) {
            throw new Error("Title is required"); // Title must not be empty
        } else if (title.length > 60) {
            throw new Error("Title is too long"); // Title must not exceed 60 characters
        }

        // Check if the user is authenticated
        if (!identity) {
            throw new Error("Unauthorized"); // Throw an error if the user is not authenticated
        }

        // Update the board's title in the database (use "Untitled" if the title is an empty string)
        const board = await ctx.db.patch(args.id, {
            title: args.title.trim() == "" ? "Untitled" : args.title,
        });

        return board; // Return the updated board
    },
});

// Mutation to favorite a board
export const favorite = mutation({
    // Define the arguments for favoriting a board
    args: { id: v.id('boards'), orgId: v.string() }, // 'id' of the board to favorite and the 'orgId'
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // Get the current user's identity

        // Check if the user is authenticated
        if (!identity) {
            throw new Error("Unauthorized"); // Throw an error if the user is not authenticated
        }

        // Retrieve the board from the database using the provided board 'id'
        const board = await ctx.db.get(args.id);
        if (!board) {
            throw new Error("Board not found"); // Throw an error if the board does not exist
        }

        const userId = identity.subject; // Get the current user's ID
        // Check if the user has already favorited the board
        const existingFavorite = await ctx.db.query('userFavorites')
            .withIndex('by_user_board', (q) =>
                q
                    .eq('userId', userId) // Check if the user has favorited this board
                    .eq('boardId', board._id)
            )
            .unique(); // Ensure it's a unique favorite

        if (existingFavorite) {
            throw new Error("Board already favorited"); // Prevent adding the same favorite multiple times
        }

        // Add the board to the user's favorites
        await ctx.db.insert('userFavorites', {
            userId, // The user's ID
            boardId: board._id, // The ID of the board
            orgId: args.orgId, // The organization ID
        });

        return board; // Return the favorited board
    }
});

// Mutation to unfavorite a board
export const unfavorite = mutation({
    // Define the arguments for unfavoriting a board
    args: { id: v.id('boards') }, // 'id' of the board to unfavorite
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // Get the current user's identity

        // Check if the user is authenticated
        if (!identity) {
            throw new Error("Unauthorized"); // Throw an error if the user is not authenticated
        }

        // Retrieve the board from the database
        const board = await ctx.db.get(args.id);
        if (!board) {
            throw new Error("Board not found"); // Throw an error if the board does not exist
        }

        const userId = identity.subject; // Get the current user's ID
        // Check if the user has favorited this board
        const existingFavorite = await ctx.db.query('userFavorites')
            .withIndex('by_user_board', (q) =>
                q
                    .eq('userId', userId) // Ensure it's the user's favorite board
                    .eq('boardId', board._id)
            )
            .unique(); // Ensure it's a unique favorite

        if (!existingFavorite) {
            throw new Error("Favorited board not found"); // Throw an error if the favorite is not found
        }

        // Remove the board from the user's favorites
        await ctx.db.delete(existingFavorite._id);

        return board; // Return the unfavorited board
    }
});


export const get = query({
    args: { id: v.id('boards') },
    handler: async (ctx, args) => {
        const board = ctx.db.get(args.id);
        return board;
    }
})