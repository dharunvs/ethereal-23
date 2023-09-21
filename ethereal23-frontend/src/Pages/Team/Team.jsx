import React from "react";
import { useEffect } from "react";
import "./Team.css";
import teamBg from "../../Assets/Images/teamBG.webp";

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

  const data = {
    name: "Dharun V S",
    dept: "Artificial Intelligence and Data Science",
    year: "Final",
  };

  const Card = ({ data }) => {
    return (
      <div className="Card">
        <div className="imgContainer">
          <img
            src="https://dvyvvujm9h0uq.cloudfront.net/com/articles/1525891879-886386-sam-burriss-457746-unsplashjpg.jpg"
            alt="profilePic"
          />
        </div>
        <div className="content">
          <h1>{data.name}</h1>
          <p>{data.dept}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="TeamPage">
      <div className="teambg">
        <img src={teamBg} alt="teamBg" />
      </div>
      <div className="teamGroup">
        <h1>Core team</h1>
        <div className="teamMembers">
          <Card data={data} />
          <Card data={data} />
          <Card data={data} />
          <Card data={data} />
          <Card data={data} />
        </div>
      </div>
      <div className="teamGroup">
        <h1>Tech team</h1>
        <div className="teamMembers">
          <Card data={data} />
        </div>
      </div>
      <div className="teamGroup">
        <h1>Media team</h1>
        <div className="teamMembers">
          <Card data={data} />
          <Card data={data} />
        </div>
      </div>
      <div className="teamGroup">
        <h1>Sponsorship & Support</h1>
        <div className="teamMembers">
          <Card data={data} />
          <Card data={data} />
          <Card data={data} />
          <Card data={data} />
          <Card data={data} />
          <Card data={data} />
        </div>
      </div>
    </div>
  );
}

export default Team;
