require('dotenv').config();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const FormData = require('form-data');
const mongoose = require('mongoose');
const { generateInterviewReportController } = require('./src/controllers/interview.controller');

async function testEndpoint() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        
        // Mock a user
        const dummyUserId = new mongoose.Types.ObjectId();
        
        // Mock express Request
        const req = {
            body: {
                jobDescription: "Software development",
                selfDescription: ""
            },
            file: undefined, // no file first to see if it works without pdf parsing
            user: { id: dummyUserId }
        };
        
        // Mock express Response
        const res = {
            status: function(s) {
                this.statusCode = s;
                return this;
            },
            json: function(data) {
                console.log("STATUS:", this.statusCode);
                console.log("RESPONSE:", JSON.stringify(data, null, 2));
            }
        };

        console.log("Calling controller...");
        await generateInterviewReportController(req, res);
        
        console.log("Done.");
        process.exit(0);
    } catch (err) {
        console.error("Script Error:", err);
        process.exit(1);
    }
}

testEndpoint();
