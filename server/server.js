const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require('./path/to/serviceAccountKey.json'); // Replace with your actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<your-database-name>.firebaseio.com' // Replace with your actual database URL
});

const allowedIP = 'YOUR_IP_ADDRESS'; // Replace with your actual IP address

app.post('/setCustomClaims', async (req, res) => {
  const userIP = req.ip; // This might need additional logic to correctly get the IP address
  const { userId } = req.body;

  if (userIP === allowedIP) {
    await admin.auth().setCustomUserClaims(userId, { allowedIP: true });
    res.status(200).send('Custom claims set');
  } else {
    await admin.auth().setCustomUserClaims(userId, { allowedIP: false });
    res.status(403).send('Access denied');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
