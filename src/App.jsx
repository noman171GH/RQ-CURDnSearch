import React, { useState } from "react";
import "./App.css";
//import { useQuery } from "@tanstack/react-query";
//import { fetchPost } from "./api/api";
import PostLists from "./components/PostLists";
import DataEditDelete from "./components/DataEditDelete";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  //********** we did it at very early stages , just to check that its working ... later we do these all in PostLists.jsx*******************
  //   const { data, isLoading, status } = useQuery({
  //     queryKey: ["post"],
  //     queryFn: fetchPost,
  //   });
  //   console.log(data, isLoading, status);
  // ****************************************************************************************************************************************
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PostLists />} />
          <Route path="/edit/:id" element={<DataEditDelete />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
//https://www.youtube.com/watch?v=k1tus-TmqCE&t=748s&ab_channel=RoadsideCoder

// https://www.youtube.com/watch?v=k1tus-TmqCE&t=982s

// https://www.npmjs.com/package/json-server
{
  /* <button onClick={() => setToggle(!toggle)}>Toggle Data</button>
<br />
<br />
<br />
{toggle && <PostLists></PostLists>} */
}
