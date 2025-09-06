const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.getSummary = functions.https.onRequest(async (req, res) => {
  try {
    const usersSnap = await admin.firestore().collection("users").get();
    // Use a collectionGroup query to get all moods across all users
    const moodsSnap = await admin.firestore().collectionGroup("moods").get();
    
    res.json({
      users: usersSnap.size,
      moods: moodsSnap.size,
    });
  } catch (e) {
    console.error("Error getting summary:", e);
    res.status(500).send("An error occurred while generating the summary.");
  }
});
