import React from "react";
import { useEffect } from "react";
import "./Team.css";

function Team() {
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

  const Card = () => {
    return (
      <div className="card">
        <div className="imgContainer">
          <img
            src="https://dvyvvujm9h0uq.cloudfront.net/com/articles/1525891879-886386-sam-burriss-457746-unsplashjpg.jpg"
            alt="profilePic"
          />
        </div>
        <div className="content">
          <div className="text">
            <h1>Dharun</h1>
            {/* <p>Artificial Intelligence and Data Science</p> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="TeamPage">
      <div className="teamGroup">
        {/* <h1>Core team</h1> */}
        <div className="teamMembers">
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
}

export default Team;
