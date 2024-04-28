import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// Get all records
router.get("/", async (req, res) => {
    try {
      const collection = await db.collection("records");
      const results = await collection.find({}).toArray();
      res.send(results).status(200);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error getting records");
    }
  });
  
  // Get a single record by id
  router.get("/:id", async (req, res) => {
    try {
      const collection = await db.collection("records");
      const query = { _id: new ObjectId(req.params.id) };
      const result = await collection.findOne(query);
  
      if (!result) {
        res.send("Not found").status(404);
      } else {
        res.send(result).status(200);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error getting record");
    }
  });
  
  // Create a new record
  router.post("/", async (req, res) => {
    try {
      const newDocument = {
        id: req.body.id,
        user_id: req.body.user_id,
        artist: req.body.artist,
        venue: req.body.venue,
        location: req.body.location,
        date: req.body.date,
      };
  
      const collection = await db.collection("records");
      const result = await collection.insertOne(newDocument);
      res.send(result).status(204);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding record");
    }
  });
  
  // Update a record by ID
router.patch("/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const updates = {
        $set: {
            id: req.body.id,
            user_id: req.body.user_id,
            artist: req.body.artist,
            venue: req.body.venue,
            location: req.body.location,
            date: req.body.date,
        },
      };
  
      let collection = await db.collection("records");
      let result = await collection.updateOne(query, updates);
      res.send(result).status(200);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating record");
    }
  });

  
  // Delete a record
  router.delete("/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
  
      const collection = db.collection("records");
      const result = await collection.deleteOne(query);
  
      res.send(result).status(200);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting record");
    }
  });

export default router;