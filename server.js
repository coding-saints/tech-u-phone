// This example uses JavaScript language features present in Node.js 6+
'use strict';

const express = require('express');
const twilio = require('twilio');
const urlencoded = require('body-parser').urlencoded;

let app = express();

// Parse incoming POST params with Express middleware
app.use(urlencoded({
    extended: false
}));

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
app.post('/voice', (request, response) => {
    // Get information about the incoming call, like the city associated
    // with the phone number (if Twilio can discover it)
    let city = request.body.FromCity;

    // Use the Twilio Node.js SDK to build an XML response
    let twiml = new twilio.TwimlResponse();
    twiml.gather({
        numDigits: 1,
        action: '/voice/numbers',
        method: 'POST'
    }, (gatherNode) => {
        gatherNode.say('Welcome, Thank you for calling Tech Uncensored. For consults press 1. Web Development, press 2. Speaking Engagements, press 3. For all other inqueries, press 4.');
    });
    twiml.redirect('/voice');

    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/voice/numbers', (req, res) => {
    let pressedDigit = req.body.Digits;
    let twiml = new twilio.TwimlResponse();

    const buttonPushed = [
        '',
        'consults',
        'web development',
        'speaking engagements',
        'all other inquires'
    ];

    if (pressedDigit > 4) {
        twiml.redirect('/voice');
    } else {
        twiml.dial({
            callerId: '+12155158324'
        }, '+18146884235');
        twiml.sms({
            from: '+12155158324',
            to: '+18146884235'
        }, buttonPushed[pressedDigit]);
    }
    console.log(twiml.toString());
    res.type('text/xml');
    res.send(twiml.toString());


});


// Create an HTTP server and listen for requests on port 3000
app.listen(3000);