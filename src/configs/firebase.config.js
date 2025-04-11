var admin = require("firebase-admin");

var serviceAccount = require('../json/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
module.exports = auth;