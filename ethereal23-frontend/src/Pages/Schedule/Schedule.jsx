import React from "react";
import { useEffect } from "react";
import "./Schedule.css";
import kcg25 from "../../Assets/Images/kcg25.webp";

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

  return (
    <div className="Schedule" style={{ textAlign: "center" }}>
      <img src={kcg25} className="schkcg" alt="" />
      <p>
        Schedule will <br /> be announced soon
      </p>
    </div>
  );
}

export default Schedule;
