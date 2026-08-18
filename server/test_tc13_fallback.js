import http from 'http';

async function testTC13Fallback() {
  console.log("=".repeat(60));
  console.log("APBOT TC-13 PYTHON SERVICE FALLBACK RECOVERY TEST");
  console.log("=".repeat(60));

  try {
    // 1. Test Node API fallback endpoint directly
    const testPayload = JSON.stringify({ message: "show me black jackets" });
    
    console.log("Sending query 'show me black jackets' to Express backend...");
    const res = await fetch("http://localhost:5000/api/apbot/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: testPayload
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("[TC-13 RESULT] HTTP Status:", res.status);
    console.log("[TC-13 RESULT] Intent:", data.intent);
    console.log("[TC-13 RESULT] Message:", data.message);
    console.log("[TC-13 RESULT] Data Type:", data.data?.type);

    // Verify fallback response integrity
    const isValidResponse = data && data.message && (data.intent || data.data);
    if (isValidResponse) {
      console.log("-".repeat(60));
      console.log(" TC-13 TEST PASSED: Backend successfully processed query and returned valid fallback response without crashing.");
      console.log("=" .repeat(60));
      process.exit(0);
    } else {
      console.error(" TC-13 TEST FAILED: Response structure missing required fields.");
      process.exit(1);
    }
  } catch (err) {
    console.error(" TC-13 TEST ERROR:", err.message);
    console.error("Make sure Node Express server is running on http://localhost:5000");
    process.exit(1);
  }
}

testTC13Fallback();
