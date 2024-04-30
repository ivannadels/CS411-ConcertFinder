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

// Create a new user
router.post("/", async (req, res) => {
    try {
      const newDocument = {
        name: req.body.name, // user name
        email: req.body.email, // user email
        // Add more fields as needed
      };
  
      const collection = await db.collection("users");
      const result = await collection.insertOne(newDocument);
      res.send(result).status(204);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding user");
    }
  });

  // Update a users location by ID
  router.patch("/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const updates = {
        $set: req.body,
      };
  
      let collection = await db.collection("users");
      let result = await collection.updateOne(query, updates);
      res.send(result).status(200);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating user");
    }
  });

  
// Delete a user by ID
router.delete("/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
  
      const collection = db.collection("users");
      const result = await collection.deleteOne(query);
  
      res.send(result).status(200);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting user");
    }
  });
  
  export default router;