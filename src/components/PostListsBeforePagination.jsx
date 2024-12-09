import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import {
  fetchPost,
  fetchPosts,
  fetchTags,
  addPost,
  updatePost,
  deletePost,
} from "../api/api.js";

//--------------------------------------------------------------To show all "posts" records--------------------------------------
const PostLists = () => {
  const queryClient = useQueryClient();
  //const [page, setPage] = useState(1); //  bydefault Page No1

  const {
    data: postData,
    isError,
    isLoading,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["post"],
    queryFn: fetchPost,
    // gcTime: 0 , // gcTime means Garbage Collection Time...n zero mean No need to do GC and forever stale
    // refetchInterval : 1000 * 5 , mean after every 5 mins refresh data
  });
  // -----------------------------------------------------------------------------------------------------------------------------------

  //-------------------------------------------------------------- for getting all "tags" , to show in list--------------------------------------
  const { data: tagsData, isLoading: isTagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    // 👇 Since this wont change we dont want to refetch it
    staleTime: Infinity,
  });
  // ----------------------------------------------------------------------------------------------------------------------------------------------

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
      queryClient.invalidateQueries({ queryKey: ["post"], exact: true });
    },

    //   await queryClient.cancelQueries({ queryKey: ["post"], exact: true });
    // },

    // onMutate: async () => {
    //   👇 Can be used to cancel outgoing queries
    //   await queryClient.cancelQueries({ queryKey: ["post"], exact: true });
    // },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     👇 Invalidate queries with a key that starts with `post`
    //     queryKey: ["posts", { page }],
    //     👇 invalidate exact query
    //     exact: true,
    //     👇 invalidate specific query key/s
    //     queryKey: ["todos", {page: 10}],
    //     👇 invalidate range of query keys
    //     predicate: (query) => query.queryKey[0] === "post" && query.queryKey[1].page >= 2,
    //   });

    //   👇 We can manually add to posts to avoid api calls
    //     queryClient.setQueryData(["post"], (old) => [data, ...old]);
    // },
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
    console.log(title, tags);
    console.log(postData.length);
    mutate({ id: postData?.length + 1, title, tags });

    e.target.reset(); // reset form
  };
  // *******************************************************************************************************

  return (
    <div className="container">
      {/* *************************************** Form UI *** To ADD Posts.... ************************************************************************ */}
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
      {/* *************************************** End of Form UI***************************************************************************** */}
      {/*------------------------- if data dont display after f5, just cut these lines of codes and f5, when text appears again paste it here.------------------------------ */}
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
      {postData?.map((post) => {
        return (
          <div key={post.id} className="post">
            <div> ID {post.id} :</div>
            <div> {post.title}</div>
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        );
      })}
      {/*--------------------------------------Ctrl+ X till here ----------------------------------------------------------------------------------------------------*/}
    </div>
  );
};

export default PostLists;
