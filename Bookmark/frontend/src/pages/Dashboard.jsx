import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { GoogleGenerativeAI } from '@google/generative-ai';
import useAuthStore from '../store/authStore';
import axios from 'axios';

const predefinedTags = [
  'Technology', 'Programming', 'Design', 'Productivity', 
  'Business', 'Education', 'Entertainment', 'News', 
  'Science', 'Health', 'Finance', 'Marketing', 
  'Gaming', 'Travel', 'Lifestyle', 'Food', 
  'Fitness', 'Art', 'Politics', 'Sports', 
  'Music', 'Environment', 'Psychology', 'History', 
  'Fashion', 'Photography', 'Startup', 'Literature', 
  'Engineering', 'Parenting'
];

function Dashboard() {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    tags: [],
    customTag: ''
  });
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userid } = useAuthStore((state) => state.userid);
  const { setLogOut } = useAuthStore((state) => state);

  const navigate = useNavigate(); 

  const addBookmark = async (bookmarkData) => {
    try {
      const response = await axios.post('http://localhost:3000/api/addBookmarks', bookmarkData);
      console.log('Bookmark added successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  };

  const suggestTags = async (url, name) => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI('AIzaSyAv_PlgOUESgqXBKYJmW5LWrPz6QS5ohLM');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Given this bookmark with name: "${name}" and URL: "${url}", 
        suggest appropriate tags from this list: ${predefinedTags.join(', ')}. 
        Return only the relevant tags as a comma-separated list.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const suggestedTagsText = response.text();
      const newTags = suggestedTagsText.split(',').map(tag => tag.trim());

      const filteredTags = newTags.filter(tag => predefinedTags.includes(tag));
      setSuggestedTags(filteredTags);

      setFormData(prev => ({
        ...prev,
        tags: [...new Set([...prev.tags, ...filteredTags])]
      }));
    } catch (error) {
      console.error('Error suggesting tags:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBookmark = {
      title: formData.name,
      url: formData.url,
      author: userid,  
      tags: formData.tags,
    };

    try {
      const response = await addBookmark(newBookmark);
      if (response) {
        setFormData({ name: '', url: '', tags: [], customTag: '' });
        setSuggestedTags([]);
      }
    } catch (error) {
      console.error('Error submitting the bookmark:', error);
    }
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleCustomTagChange = (e) => {
    setFormData(prev => ({ ...prev, customTag: e.target.value }));
  };

  const addCustomTag = () => {
    if (formData.customTag && !formData.tags.includes(formData.customTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, formData.customTag],
        customTag: ''
      }));
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const logout = () => {
    alert('Logged out!');
    setLogOut(); 
    navigate('/login'); 
  };

  const handleViewBookmarks = () => {
    navigate(`/user/view-bookmark`); 
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-teal-200 to-purple-200 p-8 text-white p-8 flex justify-center items-center">
      <div className="w-full max-w-xl bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
        <header className="flex justify-between items-center mb-6">
          <button
            onClick={logout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
          >
            Logout
          </button>
          <button
            onClick={handleViewBookmarks}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            View Bookmarks
          </button>
        </header>

        <h2 className="text-4xl font-extrabold text-center">Add New Bookmark</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-2">Bookmark Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => suggestTags(formData.url, formData.name)}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Suggesting Tags...' : 'Suggest Tags'}
            </button>
          </div>

          {/* Selected Tags */}
          <div>
            <label className="block text-lg font-medium mb-2">Selected Tags</label>
            <div className="flex flex-wrap gap-3">
              {formData.tags.map((tag) => (
                <div key={tag} className="flex items-center bg-blue-600 text-white px-4 py-1 rounded-full">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Tags */}
          {suggestedTags.length > 0 && (
            <div>
              <label className="block text-lg font-medium mb-2">Suggested Tags</label>
              <div className="flex flex-wrap gap-3">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-1 rounded-full text-sm font-semibold transition-all
                      ${formData.tags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}
                    `}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Tag */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={formData.customTag}
              onChange={handleCustomTagChange}
              placeholder="Add custom tag"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={addCustomTag}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all"
            >
              Add
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-lg font-bold hover:scale-105 transition-all"
          >
            Save Bookmark
          </button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
