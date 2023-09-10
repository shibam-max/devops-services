//provides stronger error checking and more secure code
"use strict";

// web server framework for Node.js applications
const express = require("express");
// allows requests from web pages hosted on other domains
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fileName = "app.js";
const axios = require("axios")
const { HttpException } = require("./HttpException.utils");

const app = express();
const port = 8083;

// Parses incoming JSON requests
app.use(express.json());
app.use(cors());

/** add reqId to api call */
app.use(function (req, res, next) {
  res.locals.reqId = uuidv4();
  next();
});


app.post("/add-sub", async (req, res) => {
  try {
    const { a = 0, b = 0 } = req.body;
    console.log(`A: ${a}, B: ${b}`);

    const sumResponse = await axios.get(process.env.S1_URL + "/add", { params: { a, b } });

    const diffResponse = await axios.get(process.env.S2_URL + "/sub", { params: { a, b } });

    const sum = sumResponse.data.body.sum;
    const difference = diffResponse.data.body.sum;

    res.status(200).json({
      sum,
      difference,
    });
  } catch (error) {
    console.error(error);
    const err = new HttpException(500, "Internal Server Error");
    res.status(err.status).send(err.message);
  }
});

/** 404 error */
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  return res.status(err.status).send(err.message);
});

app.listen(port, () => {
  console.log("Start", fileName, `S3 App listening at http://localhost:${port}`);
});

