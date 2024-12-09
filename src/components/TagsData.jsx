import React from "react";
import { fetchTags } from "../api/api";

const displayTags = async () => {
  try {
    const tagsData = await fetchTags();
    alert(tagsData);
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
};

export default displayTags;
