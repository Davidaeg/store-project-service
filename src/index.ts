import express from "express";

const app = express();

app.use(express.json()); //middleware to parse json body

const PORT = 3000;

app.get("/ping", (_req, res) => {
  console.log("ping");

  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
