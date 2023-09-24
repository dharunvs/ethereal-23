import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import logo from "../../Assets/Images/logo.png";
import collegeImg from "../../Assets/Images/college.webp";
import { useNavigate } from "react-router-dom";
// import chipsVid from "../../Assets/Spline/chips-main.webm";
// import spl from "../../Assets/Spline/scene.splinecode";
import chipsVidLeft from "../../Assets/Spline/chips-left-bkp.webm";
import chipsVidRight from "../../Assets/Spline/chips-right.webm";
// import { galleryImgArr } from "../../Assets/Images/gallery";
import overlay from "../../Assets/Images/homeBG.webp";
// import homePradeep from "../../Assets/Images/Pradeep.png";
import kcg25 from "../../Assets/Images/kcg25.webp";
// import kcg25 from "../../Assets/Images/kcg25b.png";
import cb1 from "../../Assets/Images/cb1.webp";
import cb2 from "../../Assets/Images/cb2.webp";
import cb3 from "../../Assets/Images/cb3.webp";

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
          autoPlay={true}
          muted={true}
          loop={true}
        ></video>
        <video
          className="HomeVidLeft"
          src={chipsVidLeft}
          autoPlay={true}
          muted={true}
          loop={true}
        ></video>
        <img src={kcg25} alt="kcg25" className="kcg25" />
      </div>
      <div className="content">
        <div className="HScreen1">
          <div className="logo">
            <img src={logo} alt="" />
            <h1>ETHEREAL</h1>
            <p>"Be all that you can be"</p>
            <h2 style={{ textShadow: "none" }}>Oct 13 - Oct 14</h2>
          </div>
          <button
            className="customButton"
            onClick={() => {
              navigate("/auth");
            }}
          >
            Buy Tickets
          </button>
        </div>
        {/* <div className="HScreen4">
          <div className="imgContainer">
            <img src={homePradeep} alt="" />
          </div>
        </div> */}
        <div className="HScreen2">
          <div className="aboutDiv">
            <div className="adTop">
              <div className="img">
                <img src={overlay} alt="" />
              </div>

              <div className="text text2">
                <h1>
                  Celebrities onboard <h2 className="mtc">More yet to come!</h2>
                </h1>
                <div className="cbs">
                  <div className="cbCB">
                    <img src={cb3} alt="" />
                    <h1>
                      Pradeep <h4 className="celebInfo">Singer</h4>
                      <h3 className="ps">Pro Show</h3>
                    </h1>
                  </div>
                  <div className="cbC1">
                    <img src={cb1} alt="" />
                    <h2>
                      Mirnaa <h4 className="celebInfo">Actress</h4>{" "}
                    </h2>
                  </div>

                  <div className="cbC2">
                    <img src={cb2} alt="" />
                    <h2>
                      Jaffer <h4 className="celebInfo">Actor & Dancer</h4>{" "}
                    </h2>
                  </div>
                </div>
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
                <h1>About KCG Tech</h1>
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
          <h1>Ethereal 2022</h1>

          {/* <HorizontalGallery /> */}
          <div
            className="gallery-wrap"
            // style={{ transform: `translateX(-${scrollX}px)` }}
            // ref={galleryContainerRef}
          >
            {galleryImgArr.map((val, key) => (
              <div className={"item"} key={key}>
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
