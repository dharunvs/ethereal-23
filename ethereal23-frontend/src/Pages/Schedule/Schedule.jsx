import React from "react";
import { useEffect } from "react";
import "./Schedule.css";

function Schedule() {
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

  return <div className="Schedule">Schedule</div>;
}

export default Schedule;
