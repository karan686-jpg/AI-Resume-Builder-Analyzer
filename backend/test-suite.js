const assert = require("assert");
const http = require("http");
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

async function runTests() {
  console.log("=== Starting Automated Integration Test Suite ===");
  await connectDB();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;
  console.log(`Test server running on port ${port}`);

  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: "Password123!",
  };

  let token = "";
  let resumeId = "";

  const request = async (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    if (token && !("Authorization" in (options.headers || {}))) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });
    const status = response.status;
    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    return { status, data };
  };

  try {
    // 1. Test Auth: Register
    console.log("1. Testing POST /api/auth/register...");
    const regRes = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(testUser),
    });
    assert.strictEqual(regRes.status, 201, `Expected 201, got ${regRes.status}: ${JSON.stringify(regRes.data)}`);
    assert(regRes.data.token, "Token should be returned on register");
    assert.strictEqual(regRes.data.user.email, testUser.email);
    console.log("✓ Registration passed.");

    // 2. Test Auth: Login
    console.log("2. Testing POST /api/auth/login...");
    const loginRes = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });
    assert.strictEqual(loginRes.status, 200, "Expected 200 on login");
    token = loginRes.data.token;
    assert(token, "Token should be present on login");
    console.log("✓ Login passed.");

    // 3. Test Auth: Get Me
    console.log("3. Testing GET /api/auth/get-me...");
    const meRes = await request("/auth/get-me");
    assert.strictEqual(meRes.status, 200);
    assert.strictEqual(meRes.data.user.email, testUser.email);
    console.log("✓ GetMe passed.");

    // 4. Test Resume: Create (Clean schema payload)
    console.log("4. Testing POST /api/resume...");
    const resumePayload = {
      title: "Full Stack Engineer Resume",
      personalInfo: {
        name: "Test Candidate",
        title: "Senior SDE",
        email: testUser.email,
        phone: "+91 9999999999",
      },
      professionalSummary: "Expert engineer in Node.js and React.",
      experience: [
        { company: "Tech Corp", role: "SDE", dates: "2023-Present", description: "Engineered high-scale systems." }
      ],
      education: [
        { institution: "IIT", degree: "B.Tech", dates: "2019-2023", fieldOfStudy: "CSE" }
      ],
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      customSections: [
        {
          title: "Projects",
          items: [{ title: "AI Resume", subtitle: "Full Stack", dates: "2024", description: "Built scalable ATS engine." }]
        }
      ]
    };
    const createRes = await request("/resume", {
      method: "POST",
      body: JSON.stringify(resumePayload),
    });
    assert.strictEqual(createRes.status, 201, `Failed to create resume: ${JSON.stringify(createRes.data)}`);
    assert(createRes.data.resume._id, "Created resume should have _id");
    resumeId = createRes.data.resume._id;
    console.log("✓ Create Resume passed.");

    // 5. Test Resume: Get All
    console.log("5. Testing GET /api/resume...");
    const listRes = await request("/resume");
    assert.strictEqual(listRes.status, 200);
    assert(Array.isArray(listRes.data.resumes), "Resumes should be an array");
    assert(listRes.data.resumes.length >= 1, "Should contain at least 1 resume");
    console.log("✓ Get All Resumes passed.");

    // 6. Test Resume: Get By ID
    console.log("6. Testing GET /api/resume/:id...");
    const getByIdRes = await request(`/resume/${resumeId}`);
    assert.strictEqual(getByIdRes.status, 200);
    assert.strictEqual(getByIdRes.data.resume.title, "Full Stack Engineer Resume");
    console.log("✓ Get Resume By ID passed.");

    // 7. Test Security: IDOR Owner-Isolation (Another user cannot access this resume)
    console.log("7. Testing IDOR Isolation (Cross-User 404 Protection)...");
    const otherUser = {
      username: `other_${Date.now()}`,
      email: `other_${Date.now()}@example.com`,
      password: "Password123!",
    };
    const otherReg = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(otherUser),
    });
    const otherToken = otherReg.data.token;
    const crossAccessRes = await request(`/resume/${resumeId}`, {
      headers: { Authorization: `Bearer ${otherToken}` },
    });
    assert.strictEqual(crossAccessRes.status, 404, "Cross-user access must return 404 to prevent IDOR enumeration");
    console.log("✓ IDOR owner-scoped security isolation passed.");

    // 8. Test Resume: Update
    console.log("8. Testing PUT /api/resume/:id...");
    const updateRes = await request(`/resume/${resumeId}`, {
      method: "PUT",
      body: JSON.stringify({ title: "Updated Senior SDE Resume" }),
    });
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateRes.data.resume.title, "Updated Senior SDE Resume");
    console.log("✓ Update Resume passed.");

    // 9. Test Resume: Delete
    console.log("9. Testing DELETE /api/resume/:id...");
    const delRes = await request(`/resume/${resumeId}`, { method: "DELETE" });
    assert.strictEqual(delRes.status, 200);
    console.log("✓ Delete Resume passed.");

    // 10. Test Interview: Get Reports List
    console.log("10. Testing GET /api/interview...");
    const reportsRes = await request("/interview");
    assert.strictEqual(reportsRes.status, 200);
    assert(Array.isArray(reportsRes.data), "Reports should be an array");
    console.log("✓ Interview reports list passed.");

    // 11. Test Auth: 409 Conflict on Duplicate Registration
    console.log("11. Testing 409 Conflict for duplicate registration...");
    const dupReg = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(testUser),
    });
    assert.strictEqual(dupReg.status, 409, "Duplicate user must return 409 Conflict");
    console.log("✓ 409 Conflict passed.");

    // 12. Test Unauthorized Access
    console.log("12. Testing 401 Unauthorized for missing token...");
    const unauthRes = await request("/resume", {
      headers: { Authorization: "" },
    });
    assert.strictEqual(unauthRes.status, 401);
    console.log("✓ 401 Unauthorized enforcement passed.");

    console.log("\n=========================================");
    console.log("🎉 ALL INTEGRATION TESTS PASSED (12/12)!");
    console.log("=========================================\n");

  } finally {
    server.close();
  }
}

runTests().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
