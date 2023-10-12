import React from "react";
import { useEffect } from "react";
import "./Team.css";
import teamBg from "../../Assets/Images/teamBG.webp";
import { teams } from "../../data";
import insta from "../../Assets/Icons/insta.png";
import kcg25 from "../../Assets/Images/kcg25.webp";

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

  const Card = ({ data, i }) => {
    return (
      <div className="Card">
        <div className="imgContainer">
          <img src={data.img} alt="profilePic" />
        </div>
        <div
          className="content"
          onClick={() => {
            if (i) {
              const a = document.createElement("a");
              a.target = "_blank";
              a.href = data.insta;
              a.click();
            }
          }}
        >
          {/* {i && <img src={insta} className="insta" />} */}

          <h1>{data.name}</h1>
          <p>{data.dept}</p>
        </div>
      </div>
    );
  };

  const CardM = ({ data, i }) => {
    return (
      <div className="CardM">
        <div className="imgContainer">
          <img src={data.img} alt="profilePic" />
        </div>
        <div
          className="content"
          onClick={() => {
            if (i) {
              const a = document.createElement("a");
              a.target = "_blank";
              a.href = data.insta;
              a.click();
            }
          }}
        >
          {/* {i && <img src={insta} className="insta" />} */}

          <h1>{data.name}</h1>
          <p>{data.desc}</p>
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
            <Card
              data={member}
              key={key}
              i={team == teams.core ? true : false}
            />
          ))}
        </div>
      </div>
    );
  };
  const TeamsM = ({ team }) => {
    return (
      <div className="teamGroup">
        <h1>{team.name}</h1>
        <div className="teamMembers">
          {team.members.map((member, key) => (
            <CardM
              data={member}
              key={key}
              i={team == teams.core ? true : false}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="TeamPage">
      <img src={kcg25} className="AllKcg25" alt="kcg25" />

      <div className="teambg">
        <img src={teamBg} alt="teamBg" />
        <img
          src={teamBg}
          alt="teamBg"
          style={{ transform: "rotate(180deg)" }}
        />
        <img src={teamBg} alt="teamBg" />
      </div>
      <TeamsM team={teams.management} />
      <TeamsM team={teams.pc} />
      <Teams team={teams.core} />
      <Teams team={teams.tech} />
      <Teams team={teams.media} />
      <Teams team={teams.support} />
      <Teams team={teams.committee} />

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
