const express = require('express');
const cors = require('cors');
const app = express();
const db = require("./config/mongoose-connection");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { generateToken } = require("./utils/generateToken");
const userModel = require("./model/user");
const postModel = require("./model/post");


// Middleware
app.use(cors({
  origin: 'http://localhost:5174', 
  credentials: true, }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/api/getPosts', async(req, res) => {

  try{
    let posts = await postModel.find({});
    return res.status(200).json({ status: 'success', data: posts });

  }catch(e){
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }

});


app.post('/api/addPost', async (req, res) => {
  const { title, content, author } = req.body;

  try {
    // Validate input
    if (!title || !content || !author) {
      return res.status(400).json({
        status: 'fail',
        message: 'Title, content, and author are required.',
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

    // Create new post
    const post = await postModel.create({
      title,
      content,
      author,
      authorName: user.username,
    });

    // Add post to user's posts
    user.posts.push(post._id);
    await user.save(); 

    return res.status(201).json({status: 'success' , message: 'Post added successfully.'});
  } catch (error) {
    console.error('Error adding post:', error); 
    return res.status(500).json({status: 'error',message: 'Internal server error.'});
  }
});


app.put('/api/updatePost/:id', async(req, res) => {

  const { title, content, author } = req.body;
  const { id } = req.params;

  try{
    let post = await postModel.findById(id);
    if(!post){
      return res.status(404).json({ status: 'error', message: 'Post not found' });
    }

    post.title = title;
    post.content = content;
    await post.save();
    return res.status(200).json({ status:'success', message: 'Post updated successfully' });

  }catch(e){
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }

});

app.delete('/api/deletePost/:id', async (req, res) => {
  const { id } = req.params;

  try {
    
    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found' });
    }

    
    const user = await userModel.findById(post.author);
    if (user) {
      user.posts = user.posts.filter((postId) => postId.toString() !== id);
      await user.save(); 
    }

    await postModel.findByIdAndDelete(id);

    return res.status(200).json({ status: 'success', message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error); // Log error for debugging
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});



app.post('/api/register', async(req, res) => {

  const { username, password, email } = req.body;
  try{

      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async (err, hash)=> {

            let user = await userModel.create({
                
                username: username,
                password: hash,
                email: email,
            })
            
            return res.status(201).json({ status: 'success', message: 'User registered successfully' });
        });
    });


  }catch(e){
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
      userid : user._id,
      token: token,
    });
  } catch (error) {
  

    return res.status(500).json({
      status: "fail",
      message: e.message,
    });
  }
});

app.post('/api/logout', async(req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});




// Start Server
app.listen(3000, () => {
  console.log();
});
