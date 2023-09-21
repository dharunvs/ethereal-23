import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import logo from "../../Assets/Images/logo.png";
import collegeImg from "../../Assets/Images/college.png";
import Spline from "@splinetool/react-spline";
import { useNavigate } from "react-router-dom";
// import chipsVid from "../../Assets/Spline/chips-main.webm";
// import spl from "../../Assets/Spline/scene.splinecode";
import chipsVidLeft from "../../Assets/Spline/chips-left.webm";
import chipsVidRight from "../../Assets/Spline/chips-right.webm";
// import { galleryImgArr } from "../../Assets/Images/gallery";
import overlay from "../../Assets/Images/homeOverlay.png";

function Home({ data }) {
  const galleryImgArr = data.galleryImgs;
  const galleryContainerRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);

  // useEffect(() => {
  //   // Function to handle vertical scroll event
  //   const handleVerticalScroll = (event) => {
  //     const verticalScrollPosition =
  //       window.scrollY ||
  //       window.scrollTop ||
  //       document.documentElement.scrollTop;

  //     // Check if the user is scrolling within the gallery
  //     if (verticalScrollPosition !== 0) {
  //       // Prevent the default vertical scrolling behavior
  //       event.preventDefault();

  //       // Update the horizontal scroll position
  //       setScrollX(verticalScrollPosition);
  //     }
  //   };

  //   // Attach the scroll event listener when the component mounts
  //   window.addEventListener("scroll", handleVerticalScroll);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener("scroll", handleVerticalScroll);
  //   };
  // }, []);

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
  //   useEffect(() => {
  //     const canvas = document.getElementById("canvas3d");
  //     const app = new Application(canvas);
  //     app.load(" ");
  //   }, []);

  const navigate = useNavigate();

  // function HorizontalGallery() {
  //   const [scrollX, setScrollX] = useState(0);

  //   // Function to handle vertical scroll event
  //   const handleVerticalScroll = (event) => {
  //     const verticalScrollPosition =
  //       window.scrollY ||
  //       window.scrollTop ||
  //       document.documentElement.scrollTop;

  //     // Check if the user is scrolling within the gallery
  //     if (verticalScrollPosition !== 0) {
  //       // Prevent the default vertical scrolling behavior
  //       event.preventDefault();

  //       // Update the horizontal scroll position
  //       setScrollX(verticalScrollPosition);
  //     }
  //   };

  //   useEffect(() => {
  //     // Attach the scroll event listener when the component mounts
  //     window.addEventListener("scroll", handleVerticalScroll);

  //     // Clean up the event listener when the component unmounts
  //     return () => {
  //       window.removeEventListener("scroll", handleVerticalScroll);
  //     };
  //   }, []);

  //   return (
  //     // <div className="horizontal-gallery" style={{ transform: `translateX(-${scrollX}px)` }}>
  //     // </div>
  //     <div
  //       className="galleryContainer"
  //       style={{ transform: `translateX(-${scrollX}px)` }}
  //     >
  //       {galleryImgArr.map((val, key) => (
  //         <img src={val} key={key} />
  //       ))}
  //     </div>
  //   );
  // }

  return (
    <div className="Home">
      <div className="homeBG">
        {/* <Spline
          id="spline"
          scene="https://prod.spline.design/HBbGfxxhz4iG6YWK/scene.splinecode"
          // scene="./../Assets/Spline/scene.splinecode"
          onLoad={(e) => {
            console.log(e);
          }}
        /> */}
        {/* <video className="HomeVid" src={chipsVid} autoPlay muted loop></video> */}
        <video
          className="HomeVidRight"
          src={chipsVidRight}
          autoPlay
          muted
          loop
        ></video>
        <video
          className="HomeVidLeft"
          src={chipsVidLeft}
          autoPlay
          muted
          loop
        ></video>
      </div>
      <div className="content">
        <div className="HScreen1">
          <div className="logo">
            <img src={logo} alt="" />
            <h1>ETHEREAL</h1>
            <p>"Be all that you can be"</p>
            <button
              className="customButton"
              onClick={() => {
                navigate("/auth");
              }}
            >
              Buy Tickets
            </button>
          </div>
        </div>
        <div className="HScreen2">
          <div className="aboutDiv">
            <div className="adTop">
              <div className="img">
                <img src={overlay} alt="" />
              </div>
              <div className="text text2">
                <h1>Celebritiy's onboard</h1>
              </div>
              <div className="text">
                <h1>About Ethereal</h1>
                <p>
                  ETHEREAL serves as a captivating platform that seamlessly
                  blends entertainment and talent, creating a space where
                  remarkable and diverse performances from various colleges take
                  center stage. Our primary focus revolves around establishing
                  KCG ETHEREAL as a stage that shines the spotlight on hidden
                  talents deserving of recognition.
                </p>
              </div>
            </div>
            <div className="adBottom">
              <div className="img">
                <img src={collegeImg} alt="collegeImg" />
              </div>
              <div className="text">
                <h1>About KCG</h1>
                <p>
                  KCG College of Technology was founded in 1998 to fulfill the
                  Founder-Chairman, Dr. KCG Verghese's vision of <br /> "To Make
                  Every Man a Success and No Man a Failure". <br />
                  <br /> This young and vibrant institution focuses on quality
                  engineering education and a spirit of innovation along with
                  holistic personality development.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="HScreen3">
          <h1>Gallery</h1>

          {/* <HorizontalGallery /> */}
          <div
            className="gallery-wrap"
            // style={{ transform: `translateX(-${scrollX}px)` }}
            // ref={galleryContainerRef}
          >
            {galleryImgArr.map((val, key) => (
              <div className={"item item-" + key} key={key}>
                <img src={val} alt={`Gallery ${key}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
