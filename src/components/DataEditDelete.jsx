import React, { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { updatePost, deletePost } from "../api/api.js";

const DataEditDelete = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const location = useLocation();
  const navigate = useNavigate();

  // Get title and tags passed via state
  const { Mode, title, tags, tagsData } = location.state || {};

  // Local state to manage the title and selected tags
  const [postTitle, setPostTitle] = useState(title || "");
  const [selectedTags, setSelectedTags] = useState(tags || []);

  const queryClient = useQueryClient();
  const {
    mutate: UpdateMutate,
    iserror: isUpdatePostError,
    error: UpdatePostError,
    reset,
  } = useMutation({
    mutationFn: updatePost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post", { page }],
        exact: true,
      });
    },
  });

  const {
    mutate: DelMutate,
    iserror: isDelPostError,
    error: DelPostError,
  } = useMutation({
    mutationFn: deletePost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post", { page }],
        exact: true,
      });
    },
  });

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

  // Handle form submission logic here (e.g., save or update the post)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!postTitle || !selectedTags) return;

    console.log(id, { id: id, title: postTitle, tags: selectedTags });
    UpdateMutate(id, {
      id: Number(id),
      title: postTitle,
      tags: selectedTags,
    });

    e.target.reset(); // reset form
  };

  const handleDelete = (id) => {
    // Perform the delete operation
    alert(id);
    DelMutate({id});
  };

  const handleCancelClick = () => {
    // Redirect to homepage
    navigate("/");
  };

  return (
    <div className="container">
      <h1>Edit Post</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Id">ID # :</label>
          <input type="text" id="Id" value={id} disabled className="postbox" />
        </div>

        {/* Title input */}
        <div>
          <label htmlFor="title">Title :</label>
          <input
            className="postbox"
            width="100%"
            type="text"
            id="title"
            value={postTitle}
            onChange={handleTitleChange}
            placeholder="Enter post title"
            required
          />
        </div>
        <br />
        <br />
        {/* Tags checkboxes */}
        <div>
          {tags && tags.length > 0 ? (
            <div className="tags">
              {tagsData?.map((tag) => {
                return (
                  <div key={tag}>
                    <input
                      type="checkbox"
                      name={tag}
                      id={tag}
                      value={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={handleTagChange}
                    />
                    <label htmlFor={tag}>{tag}</label>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No tags available</p>
          )}
        </div>
        <br />
        <br />
        {/* Submit button */}
        <button type="submit">Save Changes</button>
        <button
          onClick={handleCancelClick}
          style={{ backgroundColor: "Green" }}
        >
          Cancel
        </button>
        <br />
        <br />
        <br />
        <br />
        <button
          // onClick={handleDelete(id)}
          style={{
            backgroundColor: "RED",
            fontFamily: "Times",
            color: "White",
          }}
        >
          Delete
        </button>
      </form>
    </div>
  );
};

export default DataEditDelete;
