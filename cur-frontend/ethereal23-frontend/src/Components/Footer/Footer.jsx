import React from "react";
import logo from "../../Assets/Images/logo.png";
import { useNavigate } from "react-router-dom";
import kcg25 from "../../Assets/Images/kcg25.webp";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer>
      <div className="fTop">
        <div className="logo">
          <img
            src={logo}
            alt=""
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
        <h1
          onClick={() => {
            navigate("/");
          }}
        >
          Ethereal '23
        </h1>
        <p className="goldGlow">"Be all that you can be"</p>
        <p className="clgName">KCG College of Technology</p>
        <p className="clgLoc">Karapakkam, Chennai 600 097</p>
      </div>
      <div className="fBottom">
        <div className="fbLeft">
          {/* <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7850865227783!2d80.23770507601722!3d12.921530087389257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525c8cd4db4ed1%3A0x364f215f3cb4bb64!2sKCG%20COLLEGE%20OF%20TECHNOLOGY%2C%20Karapakkam%2C%20Chennai%2C%20Tamil%20Nadu%20600097!5e0!3m2!1sen!2sin!4v1695344714914!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
          ></iframe> */}
        </div>
        <div className="fbRight">
          <div className="fbButtons">
            <img src={kcg25} alt="kvg25" className="fkcg25" />
            <button
              onClick={() => {
                navigate("/contact");
              }}
            >
              Contact
            </button>
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = "https://www.instagram.com/kcgethereal/";
                a.target = "_blank";
                a.click();
              }}
            >
              Instagram
            </button>
            <button
              onClick={() => {
                navigate("/events");
              }}
            >
              Events
            </button>
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = "https://kcgcollege.ac.in/";
                a.target = "_blank";
                a.click();
              }}
            >
              College
            </button>
          </div>
          <p>+91 63806 88350</p>
          <p>kcgethereal@gmail.com</p>
          <div className="ll">
            <p>hey@kcgethereal.com</p>
            <p>Designed and Developed by Dharun VS and Sricharan</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
