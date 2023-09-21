import React from "react";
import { useEffect } from "react";
import "./Team.css";
import teamBg from "../../Assets/Images/teamBG.webp";
import { teams } from "../../data";

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
          <img src={data.img} alt="profilePic" />
        </div>
        <div className="content">
          <h1>{data.name}</h1>
          <p>{data.dept}</p>
        </div>
      </div>
    );
  };

  const Teams = ({ team }) => {
    return (
      <div className="teamGroup">
        <h1>{team.name}</h1>
        <div className="teamMembers">
          {team.members.map((member, key) => (
            <Card data={member} key={key} />
          ))}
          {/* <Card data={data} />
      <Card data={data} />
      <Card data={data} />
      <Card data={data} />
      <Card data={data} /> */}
        </div>
      </div>
    );
  };

  return (
    <div className="TeamPage">
      <div className="teambg">
        <img src={teamBg} alt="teamBg" />
        <img
          src={teamBg}
          alt="teamBg"
          style={{ transform: "rotate(180deg)" }}
        />
        <img src={teamBg} alt="teamBg" />
      </div>

      <Teams team={teams.core} />
      <Teams team={teams.tech} />
      <Teams team={teams.media} />
      <Teams team={teams.support} />

      {/* <div className="teamGroup">
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
      </div> */}
    </div>
  );
}

export default Team;
