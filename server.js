require('dotenv').config({ path: 'config.env' });

const express = require('express');
const mongoose = require('mongoose');
const User = require("./data");
const path = require('path');
const app = express();
const PORT = 3000;
  
// Middleware
app.use(express.json());
app.use(express.static('views'));

// Connect to MongoDB
const ATLAS_URI = process.env.ATLAS_URI;
console.log(ATLAS_URI);

mongoose.connect(ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contacts.html'));
});

app.get('/api/retrieve-data', async (req, res) => {
  try {
    const contacts = await User.find(); // Retrieve data from MongoDB
    res.json(contacts); 
  } catch (error) {
    res.status(500).send("An error occured while trying to retrieve data from the database");
  } 
});

app.post('/api/save-data', async (req, res) => {
  try {
    const {Name, email} = req.body;
    const user = new User({ Name, email });
    await user.save();
    res.status(200).json({message: "data added successfully"});
  } catch (error) {
    res.status(500).json({message: "SERVER ERROR - An error occured while trying to update the database"});
  }
})

app.delete('/api/remove-contact', async (req, res) => {
  const { email } = req.body; // Get the email from the request body

  try {
    // Find and delete the contact by its email
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the deletion was successful, send a success response
    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while trying to delete the user");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
