const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection string
const uri = "mongodb+srv://lutfor_books:2CJMG3IaHwOXvLf0@lutfor.icznznr.mongodb.net/?retryWrites=true&w=majority&appName=lutfor";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB");

    // Create a collection
    const bookCollections = client.db("BookInventory").collection("books");

    // Insert book to the database using POST method
    app.post("/upload-book", async (req, res) => {
      try {
        const data = req.body;
        const result = await bookCollections.insertOne(data);
        console.log(result);
        res.status(201).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error inserting book");
      }
    });

    // Get all books using GET method
    app.get("/all-books", async (req, res) => {
      try {
        let query = {};
        if (req.query?.category) {
          query = { category: req.query.category };
        }
        const result = await bookCollections.find(query).toArray();
        console.log(result);
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching books");
      }
    });

    // Update book data using PATCH method
    app.patch("/book/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updateBookData = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: updateBookData,
        };
        const result = await bookCollections.updateOne(filter, updateDoc, options);
        console.log(result);
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error updating book");
      }
    });

    // Delete book using DELETE method
    app.delete("/book/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await bookCollections.deleteOne(query);
        console.log(result);
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting book");
      }
    });

    //get single book
    app.get("/book/:id", async (req, res) => {
      try {
        const id = req.params.id;
       const filter ={ _id: new ObjectId(id) }
        const result = await bookCollections.findOne(filter);
        console.log(result);
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting book");
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
