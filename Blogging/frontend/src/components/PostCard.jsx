import React from 'react';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';

const PostCard = ({ post, isAuthor, onEdit, onDelete }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{post.title}</h2>

        {/* Render HTML content which may contain an <img> tag */}
        <div
          className="text-gray-600 mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }} // Render HTML content with image
        ></div>

        <div className="flex items-center text-sm text-gray-500 gap-4">
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>{post.authorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {/* Show Edit/Delete buttons only if the user is the author */}
        {isAuthor && (
          <div className="mt-4 flex gap-4">
            <button onClick={() => onEdit(post)} className="text-blue-500 hover:text-blue-700">Edit</button>
            <button onClick={() => onDelete(post._id)} className="text-red-500 hover:text-red-700">Delete</button>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
