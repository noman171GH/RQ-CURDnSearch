import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  fetchPost,
  fetchTags,
  addPost,
  updatePost,
  deletePost,
} from "../api/api.js";

//--------------------------------------------------------------To show all "posts" records--------------------------------------
const PostLists = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1); //  bydefault Page No1

  const {
    data: postData,
    isError,
    isLoading,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["post", { page }],
    queryFn: () => fetchPost(page),
    staleTime: 1000 * 60 * 5,
    // gcTime: 0 , // gcTime means Garbage Collection Time...n zero mean No need to do GC and forever stale
    // refetchInterval : 1000 * 5 , mean after every 5 mins refresh data
  });
  // -----------------------------------------------------------------------------------------------------------------------------------

  //------------------------------------- for getting all "tags" , to show in list--------------------------------------
  const { data: tagsData, isLoading: isTagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    // 👇 Since this wont change we dont want to refetch it
    staleTime: Infinity,
  });
  // ---------------------------------------------------------------------------------------------------------------------------------

  const {
    mutate,
    iserror: isAddPostError,
    isPending,
    error: AddPostError,
    reset,
  } = useMutation({
    mutationFn: addPost,

    onMutate: () => {
      //return { id: 1 };
      //   👇 Can return "context" to =====> onSuccess : (data,variable , context)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["post", { page }],
        exact: true,
      });
    },
  });

  // ************************************* Form submitt**********************************************
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // ceating a object  ....https://www.w3schools.com/jsref/jsref_obj_map.asp
    console.log(typeof formData); //object
    console.log(formData.keys()); // FormData Iterator { constructor: Iterator() }
    const title = formData.get("title");

    const tags = Array.from(formData.keys()).filter(
      // The Array.from() static method creates a new, shallow-copied Array instance from an iterable or array-like object.
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from

      (key) => formData.get(key) === "on" //The Map.get() method is a convenient way to retrieve the value associated with a specific key in a Map object.
      // https://www.geeksforgeeks.org/javascript-map-get-method/
    );

    if (!title || !tags) return;
    console.log(typeof postData); // object
    console.log(postData); // Object { first: 1, prev: null, next: 2, last: 6, pages: 6, items: 55, data: (10) […] }
    console.log(title, tags); // But in certain circumstances and owing to the claims of duty |> Array [ "classic", "fiction" ] -- this is going to be id 56 data
    console.log(postData?.items); //55
    mutate({ id: postData?.items + 1, title, tags }); // 55 + 1

    e.target.reset(); // reset form
  };
  // *******************************************************************************************************

  const navigate = useNavigate();

  const handleEdit = (post) => {
    navigate(`/edit/${post.id}`, {
      state: {
        Mode: "Edit",
        title: post.title,
        tags: post.tags,
        tagsData: tagsData,
      },
    });
  };

  return (
    <div className="container">
      <h1 className="title">React Query</h1>
      <h2 className="title">My Posts</h2>
      {/* *************************************** Form UI *** To ADD Posts.... ************************************************** */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your post.."
          className="postbox"
          name="title"
        />
        <div className="tags">
          {tagsData?.map((tag) => {
            return (
              <div key={tag}>
                <input name={tag} id={tag} type="checkbox" />
                <label htmlFor={tag}>{tag}</label>
              </div>
            );
          })}
        </div>
        <button disabled={isPending}>
          {isPending ? "Posting..." : "Add Post"}
        </button>
        <br />
        <br />
        <br />
      </form>
      {/* *************************************** End of Form UI**************************************************************** */}
      {/*-------- if data dont display after f5, just cut these lines of codes and f5, when text appears again paste it here.---- */}
      {(isLoading || isPending) && <p>LOADING*****</p>}{" "}
      {/* if its loading show Loading **** */}
      {(isError || AddPostError) && (
        <p onClick={() => reset()}>
          {" "}
          {/* if click , error msg will disappear*/}
          {error?.message + ":   we are facing error......"}
        </p>
      )}
      {/* if isError is true .... ? mean if throw an error object, show message of object error... for more https://www.w3schools.com/js/js_operators.asp*/}
      {postData?.data?.map((post) => {
        return (
          <div key={post.id} className="post">
            <div> ID {post.id} :</div>
            <div> {post.title}</div>
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
            <div>
              {".          ============        ."}
              <button onClick={() => handleEdit(post)} className="button">
                Mutate
              </button>
            </div>
          </div>
        );
      })}
      {/*----------------------------Ctrl+ X till here ---------------------------------------------------------------*/}
      {/* ******************************************** PAGINATION **************************************************** */}
      <div className="pages">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
          disabled={!postData?.prev}
        >
          Previous Page
        </button>
        <span>Current Page : {page}</span>
        <button
          onClick={() => {
            if (!isPlaceholderData && postData?.next) {
              setPage((old) => old + 1);
            }
          }}
          // Disable the Next Page button until we know a next page is available
          disabled={isPlaceholderData || !postData?.next}
        >
          Next Page
        </button>
      </div>
      {/* **************************************************************************************************** */}
    </div>
  );
};

export default PostLists;
