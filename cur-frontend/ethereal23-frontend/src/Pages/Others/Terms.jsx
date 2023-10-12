import React from "react";
import { useEffect } from "react";
import "./Others.css";

function Terms() {
  function scrollToId(id) {
    var element = document.getElementById(id);
    element.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }
  useEffect(() => {
    scrollToId("root");
  }, []);

  return <div>Terms</div>;
}

export default Terms;
