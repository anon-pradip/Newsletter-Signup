const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const path = require("path");
const { json } = require("express/lib/response");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/", function (req, res) {
  const { firstName, lastName, email } = req.body;

  //Condtruct request data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const postData = JSON.stringify(data);

  const options = {
    url: "https://us17.api.mailchimp.com/3.0/lists/32411140c7",
    method: "POST",
    headers: {
      Authorization: "auth 8bde9a2c0a77b9d6147ad7cf3132e01a-us17",
    },
    body: postData,
  };

  request(options, (err, response, body) => {
    if (err) {
      res.redirect("/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/public/success.html");
      } else {
        res.sendFile(__dirname + "/public/failure.html");
      }
    }
  });
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});

//List ID key = 32411140c7
//API Key = 8bde9a2c0a77b9d6147ad7cf3132e01a-us17
