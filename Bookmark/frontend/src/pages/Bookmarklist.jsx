import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Trash2 } from 'lucide-react';

function BookmarksList() {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTags, setSearchTags] = useState('');
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const navigate = useNavigate();
  const { userid } = useAuthStore((state) => state.userid);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/getBookmarks/${userid}`);
        if (response.data.status === 'success') {
          setBookmarks(response.data.data);
          setFilteredBookmarks(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };
    fetchBookmarks();
  }, [userid]);

  useEffect(() => {
    if (searchTags === '') {
      setFilteredBookmarks(bookmarks);
    } else {
      const filtered = bookmarks.filter(bookmark =>
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchTags.toLowerCase()))
      );
      setFilteredBookmarks(filtered);
    }
  }, [searchTags, bookmarks]);

  const handleDelete = async (bookmarkId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/deleteBookmarks/${bookmarkId}`);
      if (response.data.status === 'success') {
        setBookmarks(bookmarks.filter(bookmark => bookmark._id !== bookmarkId));
        setFilteredBookmarks(filteredBookmarks.filter(bookmark => bookmark._id !== bookmarkId));
        alert('Bookmark deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-200 to-purple-200 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">Your Saved Bookmarks</h2>
            <button
              onClick={() => navigate('/user/dashboard')}
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="mb-6 max-w-md">
            <input
              type="text"
              value={searchTags}
              onChange={(e) => setSearchTags(e.target.value)}
              className="w-full px-6 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700"
              placeholder="Search by tags..."
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border shadow-sm">
            <table className="min-w-full table-auto bg-white">
              <thead className="bg-gradient-to-r from-teal-500 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium">Bookmark Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">URL</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Tags</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {filteredBookmarks.length > 0 ? (
                  filteredBookmarks.map((bookmark) => (
                    <tr key={bookmark._id} className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4 text-sm text-gray-800">{bookmark.title}</td>
                      <td className="px-6 py-4 text-sm text-blue-600">
                        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {bookmark.url}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        {bookmark.tags.map((tag, index) => (
                          <span key={index} className="inline-block bg-teal-100 text-teal-700 px-2.5 py-0.5 rounded-full text-xs mr-2">
                            {tag.trim()}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDelete(bookmark._id)}
                          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center transition-all"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No bookmarks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookmarksList;
