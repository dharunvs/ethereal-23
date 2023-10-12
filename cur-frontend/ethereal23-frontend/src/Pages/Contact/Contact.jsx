import React from "react";
import { useEffect } from "react";
import "./Contact.css";
import { teams } from "../../data";
import kcg25 from "../../Assets/Images/kcg25.webp";

function Contact() {
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

  const Card = ({ data }) => {
    return (
      <div className="Card">
        <div className="imgContainer">
          <img src={data.img} alt="profilePic" />
        </div>
        <div className="content">
          <h1>{data.name}</h1>
          <p>{data.dept}</p>
          <br />
          <p>{data.phone}</p>
        </div>
      </div>
    );
  };

  const Teams = ({ team }) => {
    return (
      <div className="teamGroup">
        {/* <h1>{team.name}</h1> */}
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
        <div className="emailContact">kcgethereal@gmail.com</div>
      </div>
    );
  };

  return (
    <div className="Contact">
      <img src={kcg25} className="AllKcg25" alt="kcg25" />

      <Teams team={teams.contact} />
    </div>
  );
}

export default Contact;
