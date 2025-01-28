import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, PenSquare } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Editor from '../components/Editor';
import useAuthStore from '../store/authStore';

function Dashboard() {
  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { userid } = useAuthStore((state) => state.userid);
  const { setLogOut } = useAuthStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getPosts');
        if (response.data.status === 'success') {
          setPosts(response.data.data);
        } else {
          console.error('Invalid response format:', response.data);
          alert('Failed to load posts. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, [posts]);


  // Used for publishing the post
  
  const handlePublish = async () => {
    if (!userid) return;
  
    // Check if title is empty
    if (!title.trim()) {
      toast.error("Title is required to publish the post.");
      return;
    }
  
    const newPost = {
      title,
      content,
      author: userid,
    };
  
    try {
      const response = await axios.post('http://localhost:3000/api/addPost', newPost, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.status === 201) {
        setPosts((prevPosts) => [response.data, ...prevPosts]);
        resetForm();
      } else {
        alert('Failed to publish the post');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('An error occurred while publishing the post');
    }
  };

  // To take care of editing the post
  
  const handleEdit = async () => {
    if (!editPostId) {
      toast.error("No post selected for editing.");
      return;
    }
  
    // Check if title is empty
    if (!title.trim()) {
      toast.error("Title is required to update the post.");
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:3000/api/updatePost/${editPostId}`, { title, content });
      if (response.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === editPostId ? { ...post, title, content } : post))
        );
        resetForm();
        toast.success("Post updated successfully!");
      } else {
        toast.error('Failed to update the post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('An error occurred while updating the post');
    }
  };
  

  // Used for deleting posts

  const handleDelete = async (postId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/deletePost/${postId}`);
      if (response.status === 200) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        toast.success('Post Deleted successfully');
      } else {
        toast.error('Failed to delete the post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('An error occurred while deleting the post');
    }
  };

  // Used to reset form 

  const resetForm = () => {
    setIsWriting(false);
    setIsEditing(false);
    setEditPostId(null);
    setTitle('');
    setContent('');
  };

  const filteredPosts = (Array.isArray(posts) ? posts : []).filter(
    (post) =>
      (post.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) || '') ||
      (post.content?.toLowerCase()?.includes(searchQuery.toLowerCase()) || '')
  );


  // Used for logging out the user

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/logout",
        {},
        { withCredentials: true }
      );
  
      if (response.data.status === "success") {
        toast.success('Post Deleted successfully');
        setLogOut();
        setTimeout(() => {

          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (

    
    <div className="min-h-screen bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable pauseOnFocusLoss />
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold text-gray-900">Blogify</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsWriting(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
              >
                <PenSquare size={20} />
                Create New Post
              </button>

              <button
                onClick={() => handleLogout()}
                className="flex items-center gap-2 bg-red-400 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isWriting || isEditing ? (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <input
                type="text"
                placeholder="Enter post title"
                className="w-full text-3xl font-bold mb-6 p-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
            />
            <Editor content={content} onChange={setContent} />
            <div className="mt-6 flex justify-end gap-6">
              <button
                onClick={resetForm}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={isEditing ? handleEdit : handlePublish}
                className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition duration-300"
              >
                {isEditing ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  isAuthor={post.author === userid}
                  onEdit={(post) => {
                    setIsEditing(true);
                    setEditPostId(post._id);
                    setTitle(post.title);
                    setContent(post.content);
                  }}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center w-full col-span-3">No posts available. Start writing!</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
