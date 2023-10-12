import React from "react";
import { useEffect } from "react";
import "./Others.css";

function Privacy() {
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

  return <div>Privacy</div>;
}

export default Privacy;
