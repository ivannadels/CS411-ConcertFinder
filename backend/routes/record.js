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
  
  // Get all records associated with a user ID
  router.get("/:user_id", async (req, res) => {
    try {
      const collection = await db.collection("records");
      const result = await collection.find({user_id: req.params.user_id}).toArray();
  
      if (!result) {
        res.send("Records not found for given user id").status(404);
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
        id: req.body.id,  //concert id
        user_id: req.body.user_id,  //user id
        artist: req.body.artist,  //artist name
        venue: req.body.venue,  //venue name
        location: req.body.location,  //location of the venue
        date: req.body.date, //date of the concert
      };
  
      const collection = await db.collection("records");
      const result = await collection.insertOne(newDocument);
      res.send(result).status(204);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding record");
    }
  });
  
  // Update a single record by record ID
router.patch("/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const updates = {
        $set: req.body
      };
  
      let collection = await db.collection("records");
      let result = await collection.updateOne(query, updates);
      res.send(result).status(200);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating record");
    }
  });


  // Delete a record by record ID
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

  // Export the router instance to be used by the server.
export default router;