const express = require('express');
const cors = require('cors');
const app = express();
const db = require("./config/mongoose-connection");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { generateToken } = require("./utils/generateToken");
const userModel = require("./model/user");
const bookmarkModel = require("./model/bookmarks");
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/api/getBookmarks/:id', async (req, res) => {
  try {
    let bookmarks = await bookmarkModel.find({ user: req.params.id });
    return res.status(200).json({ status: 'success', data: bookmarks });
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.post('/api/addBookmarks', async (req, res) => {
  const { title, url, author, tags } = req.body;  // Now receiving tags from the frontend

  try {
    // Validate input
    if (!title || !url || !author) {
      return res.status(400).json({
        status: 'fail',
        message: 'Title, URL, and author are required.',
      });
    }

    // Check if the author exists
    const user = await userModel.findById(author);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'Author not found.',
      });
    }

    // Create new bookmark with the custom tags provided by the frontend
    const bookmark = await bookmarkModel.create({
      title,
      url,
      user: author,  // Storing the author (user) reference correctly
      tags,  // Storing custom tags provided by the frontend
    });

    // Add the bookmark to the user's bookmarks array
    user.bookmarks.push(bookmark._id);
    await user.save();

    return res.status(201).json({
      status: 'success',
      message: 'Bookmark added successfully.',
      data: bookmark,  // Return the created bookmark data in response
    });
  } catch (error) {
    console.error('Error adding Bookmark:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
});


app.delete('/api/deleteBookmarks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await bookmarkModel.findById(id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found' });
    }

    const user = await userModel.findById(post.author);
    if (user) {
      user.bookmarks = user.bookmarks.filter((Id) => Id.toString() !== id);
      await user.save(); 
    }

    await bookmarkModel.findByIdAndDelete(id);

    return res.status(200).json({ status: 'success', message: 'Bookmarks deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return res.status(500).json({ status: 'error', message: 'Error generating salt' });
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.status(500).json({ status: 'error', message: 'Error hashing password' });
        }

        let user = await userModel.create({
          username: username,
          password: hash,
          email: email,
        });

        return res.status(201).json({ status: 'success', message: 'User registered successfully' });
      });
    });
  } catch (e) {
    return res.status(500).json({ status: 'error', message: e.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Username and password are required",
      });
    }

    // Find user by username
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Check if the password matches
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateToken(username);
    res.cookie('token', token);

    // Respond with success
    return res.json({
      status: "success",
      message: "Login successful",
      userid: user._id,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

app.post('/api/logout', async (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});

// Start Server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
