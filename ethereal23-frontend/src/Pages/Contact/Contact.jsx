import React from "react";
import { useEffect } from "react";
import "./Contact.css";

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

  return <div className="Contact">Contact</div>;
}

export default Contact;
