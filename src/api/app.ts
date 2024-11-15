import express from "express";
import pkg from "../../package.json";

export const app = express();

app.get("/", (req, res) => {
  res.json({
    name: pkg.name,
  });
});
