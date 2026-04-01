require('dotenv').config();
const { generateInterviewReport } = require('./src/services/ai.service');

async function test() {
    try {
        await generateInterviewReport({
            jobDescription: "sde",
            resume: "test resume text",
            selfDescription: ""
        });
    } catch (err) {
        console.log("Error properties:", Object.keys(err));
        console.log("Status:", err.status, typeof err.status);
        console.log("StatusCode:", err.statusCode);
        console.log("Message:", err.message);
        console.log(JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    }
}
test();
