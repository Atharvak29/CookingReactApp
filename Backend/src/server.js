import express from "express"
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favouritesTable } from "./db/schema.js";

const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json())

app.get("/api/health", (req, res) => {
    res.status(200).json({ success :true});
});

app.post("api/favorites", async (req, res)=> {
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

app.listen(PORT, () => {console.log("Port is running on ",PORT);
});



