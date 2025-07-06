import express from "express"
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favouritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";

const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json())

app.get("/api/health", (req, res) => {
    res.status(200).json({ success :true});
});

app.post("/api/favorites", async (req, res)=> {
    try
    {
        const {userId, recipeID, title, image, cookTime, servings} = req.body; 

        if(!userId || !recipeID || !title)
        {
            return res.status(400).json({error : "Missing data"});
        }
        const newFavourite = await db.insert(favouritesTable).values({
            userId, 
            recipeID, 
            title, 
            image,
            cookTime,
            servings
        }).returning();

        res.status(201).json(newFavourite[0])
    }
    catch(error)
    {
        console.log("Error adding favourites", error);
        res.status(500).json({error: "Something went wrong"});
    }
});


app.delete("/api/favorites/:userId/:recipeID", async (req, res) => {
    try
    {
        const {userId, recipeID} = req.params

        await db.delete(favouritesTable).where(and(eq(favouritesTable.userId, userId),eq(favouritesTable.recipeID, parseInt(recipeID))));

        res.status(200).json({message : "Favourite removed successfully"});
    }
    catch (error)
    {
        console.log("Error Removing favourites", error);
        res.status(500).json({error: "Something went wrong"});
    }
}); 

app.listen(PORT, () => {console.log("Port is running on ",PORT);
});



