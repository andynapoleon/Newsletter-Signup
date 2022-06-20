//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();

app.use(express.static("public")); // public is a new folder.

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // create desired data object following the request body parameters rules on MailChimp
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  // we want to send the JSON data to the API (the inputs)
  const jsonData = JSON.stringify(data);

  // url contains endpoint and list_id to subscribe members to the right list
  // us + API key part
  const url = 'https://us14.api.mailchimp.com/3.0/lists/32dfcd7a5a';

  // enable responses to POST requests and authentication - options
  const options = {
    method: "POST",
    auth: "andy:2d8a4e7761efc9343d6b1ac12bf1375b-us14"
  }

  // http.request used for POST requests, https.get used for GET requests.
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  // send the data to the MailChimp server
  request.write(jsonData);
  request.end()
});

// redirects user to the home route if signing up fails
app.post("/failure", function(req, res) {
  res.redirect("/");
})

// let Heroku choose a port to run on
// we can at the same time run on local host
app.listen(process.env.PORT || 3000, function() {
  console.log("on port 3000");
});

//API key
//2d8a4e7761efc9343d6b1ac12bf1375b-us14

//list id
//32dfcd7a5a
