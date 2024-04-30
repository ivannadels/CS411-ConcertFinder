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
  
  // Get a single record by record id
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

  // Route to set a user's location
router.patch("/location/:userId", async (req, res) => {
  try {
      // Extract the user ID from the request parameters
      const userId = req.params.userId;

      // Extract the location from the request body
      const { location } = req.body;

      // Check if the user exists
      const collection = await db.collection("users");
      const existingUser = await collection.findOne({ _id: new ObjectId(userId) });

      if (existingUser) {
          // If the user exists, update the location
          await collection.updateOne(
              { _id: new ObjectId(userId) }, // Filter by user ID
              { $set: { location: location } } // Set the location field
          );

          // Send a success response
          res.send({ message: "User location updated successfully" }).status(200);
      } else {
          // If the user doesn't exist, create a new user with the specified location
          await collection.insertOne({
              _id: new ObjectId(userId),
              location: location
          });

          // Send a success response
          res.send({ message: "New user created with location" }).status(201);
      }
  } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).send("Error setting user's location");
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