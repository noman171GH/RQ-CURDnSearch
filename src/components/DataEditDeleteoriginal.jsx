import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const DataEditDelete = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const location = useLocation();

  // Get title and tags passed via state
  const { title, tags } = location.state || {};

  // Local state to manage the title and selected tags
  const [postTitle, setPostTitle] = useState(title || "");
  const [selectedTags, setSelectedTags] = useState(tags || []);

  useEffect(() => {
    if (title) {
      setPostTitle(title);
    }
    if (tags) {
      setSelectedTags(tags);
    }
  }, [title, tags]);

  // Handle title change
  const handleTitleChange = (e) => {
    setPostTitle(e.target.value);
  };

  // Handle checkbox changes
  const handleTagChange = (e) => {
    const tag = e.target.value;
    if (e.target.checked) {
      setSelectedTags((prevTags) => [...prevTags, tag]);
    } else {
      setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., save or update the post)
    console.log("Post updated:", { id, title: postTitle, tags: selectedTags });
  };

  return (
    <div>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        {/* Title input */}
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={postTitle}
            onChange={handleTitleChange}
            placeholder="Enter post title"
          />
        </div>
        {/* Tags checkboxes */}
        <div>
          <label>Tags:</label>
          {tags && tags.length > 0 ? (
            tags.map((tag) => (
              <div key={tag}>
                <input
                  type="checkbox"
                  id={tag}
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={handleTagChange}
                />
                <label htmlFor={tag}>{tag}</label>
              </div>
            ))
          ) : (
            <p>No tags available</p>
          )}
        </div>
        {/* Submit button */}
        <button type="submit">Save Changes</button>
        <button>Cancel</button>
        <div>
          <br />
          <br />
          <button>Delete</button>
        </div>
      </form>
    </div>
  );
};

export default DataEditDelete;
