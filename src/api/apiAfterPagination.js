
// const fetchPost = async () => {
//   const response = await fetch( `http://localhost:8000/posts?_sort=-id` ); // _sort=-id .... sort = minus id means sort in reverse order. mean Last added , first display

//   if (!response.ok) {
//       throw new Error(`Failed to fetch posts. Status: ${response.status}`);
//     }
//     const postData = await response.json();
//     return postData;
//   };
  
  const fetchTags = async () => {
    const response = await fetch("http://localhost:8000/tags");
    const tagsData = await response.json();
    return tagsData;
  };


const fetchPost = async (page) => {
      const response = await fetch(
        `http://localhost:8000/posts?_sort=-id&${page ? `_page=${page}&_per_page=10` : ""}`
      );
    
      if (!response.ok) {
        throw new Error(`Failed to fetch posts. Status: ${response.status}`);
      }
    
      const postData = await response.json();
      return postData;
    };
    

    
const addPost = async (post) => {
      const response = await fetch("http://localhost:8000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
    
      return response.json();
    };


    // -----------------------------------------CHAT GPT Example to update n delete---------------------------------------------------------
    const updatePost = async (postId, updatedPost) => {
      const response = await fetch(`http://localhost:8000/posts/${postId}`, {
        method: "PUT", // HTTP method for updating a resource
        headers: {
          "Content-Type": "application/json", // Ensure the body is in JSON format
        },
        body: JSON.stringify(updatedPost), // Convert the updated post object to JSON
      });
    
      if (!response.ok) {
        throw new Error("Failed to update the post"); // Handle error if the update fails
      }
    
      return response.json(); // Return the updated post data
    };

    const deletePost = async (postId) => {
      const response = await fetch(`http://localhost:8000/posts/${postId}`, {
        method: "DELETE", // HTTP method for deleting a resource
      });
    
      if (!response.ok) {
        throw new Error("Failed to delete the post"); // Handle error if the deletion fails
      }
    
      return response.json(); // Return confirmation or any necessary response
    };

   //-------------------------------------------------------------------------------------------------------------------------------------------

    
export {fetchPost, fetchTags, addPost,updatePost,deletePost};
// export {fetchPost, fetchPosts, fetchTags, addPost,updatePost,deletePost};
  