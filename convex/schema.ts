import { v } from "convex/values"; // Importing 'v' which is a validator to define data types
import { defineSchema, defineTable } from 'convex/server'; // Importing schema and table definition functions
import { title } from "process"; // Imported 'title' from the process module (but unused in this file)

export default defineSchema({
    // Define a 'boards' table schema
    boards: defineTable({
        title: v.string(),        // 'title' of the board as a string
        orgId: v.string(),        // 'orgId' represents the organization this board belongs to (string)
        authorId: v.string(),     // 'authorId' represents the user ID of the board creator (string)
        authorName: v.string(),   // 'authorName' represents the creator's name (string)
        imageUrl: v.string()      // 'imageUrl' is a string representing the image associated with the board
    })
    // Index by 'orgId' for efficient querying
    .index('by_org', ['orgId'])  // Create an index named 'by_org' for quick lookup of boards by 'orgId'
    
    // Define a search index for the 'title' field with a filter for 'orgId'
    .searchIndex("search_title", {
        searchField: "title",     // The field to be searched is 'title'
        filterFields: ["orgId"]   // Only search results within the same 'orgId' will be filtered
    }),
    
    // Define a 'userFavorites' table schema
    userFavorites: defineTable({
        orgId: v.string(),        // 'orgId' of the organization the user favorite belongs to
        userId: v.string(),       // 'userId' represents the user who has favorited the board
        boardId: v.id('boards')   // 'boardId' is a reference to the 'boards' table (foreign key relationship)
    })
    // Index to search by 'boardId' to find all users who favorited a board
    .index('by_board', ['boardId'])  // Create an index named 'by_board' for fast lookup by 'boardId'
    
    // Index to find favorites by both 'userId' and 'orgId'
    .index('by_user_org', ['userId', 'orgId'])  // Efficient lookup by user and organization
    
    // Index to find a specific board favorited by a user
    .index('by_user_board', ['userId', 'boardId'])  // Efficient lookup for a specific user and board combination
    
    // Index to find a board favorited by a user within a specific organization
    .index('by_user_board_org', ['userId', 'boardId', 'orgId']) // Efficient lookup by user, board, and orgId
})
