import React, { useState, useEffect } from "react";
import axios from "axios";

function Shortener({ token }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [userUrls, setUserUrls] = useState([]);

  useEffect(() => {
    fetchUserUrls();
  }, []);

  const fetchUserUrls = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/urls", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserUrls(response.data);
    } catch (err) {
      alert("Error fetching user URLs");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/shorten",
        { originalUrl, alias },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShortUrl(response.data.shortUrl);
      fetchUserUrls();
    } catch (err) {
      alert("Error shortening URL");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-8 space-y-6 overflow-hidden">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center">URL Shortener</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Original URL</label>
            <input
              type="url"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Custom Alias (Optional)</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Shorten URL
          </button>
        </form>
        {shortUrl && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Shortened URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {shortUrl}
            </a>
          </div>
        )}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your URLs</h2>
          <ul className="space-y-4 overflow-y-auto max-h-96">
            {userUrls.map((url) => (
              <li key={url._id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <a
                    href={`http://localhost:5000/${url.shortUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-lg font-medium hover:underline"
                  >
                    {`http://localhost:5000/${url.shortUrl}`}
                  </a>
                  <p className="text-xs text-gray-500 mt-1">Original URL: {url.originalUrl}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Clicks:</span>
                  <span className="bg-blue-100 text-blue-500 py-1 px-3 rounded-full">
                    {url.clicks}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Shortener;
