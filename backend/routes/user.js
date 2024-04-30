import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
    try {
      const collection = await db.collection("users");
      const results = await collection.find({}).toArray();
      res.send(results).status(200);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error getting users");
    }
  });

  // Get a user's location by user ID
router.get("/location/:user_id", async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const collection = await db.collection("users");
      const user = await collection.findOne({ user_id });
      
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.status(200).send(user.location);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error getting user's location");
    }
});


// Create a new user
router.post("/", async (req, res) => {
    try {
      const newDocument = {
        user_id: req.body.user_id, // user id
        location: req.body.location, // user location
      };
  
      const collection = await db.collection("users");
      const result = await collection.insertOne(newDocument);
      res.send(result).status(200);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding user");
    }
  });

  // Update a users location by ID
  //NOTE: HAS YET TO BE TESTED
  router.patch("/:user_id", async (req, res) => {
    try {
      const query = { user_id: new ObjectId(req.params.user_id) };
      const updates = {
        $set: {location: req.body.location} 
      };
  
      let collection = await db.collection("users");
      let result = await collection.updateOne(query, updates);
      res.send(result).status(200);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating user");
    }
  });

  
// Delete a user by user ID
  //NOTE: HAS YET TO BE TESTED
router.delete("/:user_id", async (req, res) => {
    try {
      const query = { user_id: new ObjectId(req.params.user_id) };
  
      const collection = db.collection("users");
      const result = await collection.deleteOne(query);
  
      res.send(result).status(200);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting user");
    }
  });
  
  export default router;