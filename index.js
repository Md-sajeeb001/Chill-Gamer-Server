require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

// middel ware !
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("chill gamer data coming soon");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

const uri = `mongodb+srv://${process.env.GAME_NAME}:${process.env.GAME_PASS}@cluster0.e4qpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const gameReviewCollection = client
      .db("gameReviewDB")
      .collection("gameReview");

    const myWatchlistCollection = client
      .db("gameReviewDB")
      .collection("myWatchlist");

    const blogsCollection = client.db("gameReviewDB").collection("blogs");

    //  ======================================= //

    app.get("/gameReviews", async (req, res) => {
      const quary = gameReviewCollection.find();
      const result = await quary.toArray();
      res.send(result);
    });

    app.get("/gameReviews/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await gameReviewCollection.findOne(quary);
      res.send(result);
    });

    app.post("/gameReviews", async (req, res) => {
      const doc = req.body;
      const result = await gameReviewCollection.insertOne(doc);
      res.send(result);
    });

    app.put("/gameReviews/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const doc = req.body;
      const updateDoc = {
        $set: {
          thumbnail: doc.thumbnail,
          select: doc.select,
          rating: doc.rating,
          name: doc.name,
          email: doc.email,
          description: doc.description,
          Gamename: doc.Gamename,
          publishing: doc.publishing,
        },
      };
      const result = await gameReviewCollection.updateOne(
        quary,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.delete("/gameReviews/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await gameReviewCollection.deleteOne(quary);
      res.send(result);
    });

    // MY WATCH LIST COLLECTION!
    app.post("/myWatchlist", async (req, res) => {
      const doc = req.body;
      const result = await myWatchlistCollection.insertOne(doc);
      res.send(result);
    });

    app.get("/myWatchlist", async (req, res) => {
      const quary = myWatchlistCollection.find();
      const result = await quary.toArray();
      res.send(result);
    });

    // get blogs from db
    app.get("/blogs", async (req, res) => {
      const blogs = await blogsCollection.find().toArray();
      res.send(blogs);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
