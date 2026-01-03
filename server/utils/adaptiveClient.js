const axios = require("axios");

async function callAdaptiveEngine(payload) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/adaptive/next",
      payload,
      { timeout: 3000 }
    );
    return response.data;
  } catch (err) {
    console.error("Adaptive engine failed, fallback used");
    return {
      next_difficulty: "easy",
      next_topic: "same",
    };
  }
}

module.exports = { callAdaptiveEngine };
