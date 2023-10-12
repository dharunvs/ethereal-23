import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../data";
// import logo from "../../Assets/Images/logo.png";
import vid from "../../Assets/Spline/gradient-waves.webm";
// import vid2 from "../../Assets/Spline/gradient-waves.mp4";
import { icons } from "../../Assets/Icons";
import kcg25 from "../../Assets/Images/kcg25.webp";
import QRCode from "qrcode";
import { events } from "../../data";

import "./Profile.css";

function Profile() {
  // function scrollToId(id) {
  //   var element = document.getElementById(id);
  //   element.scrollIntoView({
  //     block: "start",
  //     behavior: "smooth",
  //   });
  // }
  // useEffect(() => {
  //   scrollToId("root");
  // }, []);

  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const [qrCodeDataURL, setQRCodeDataURL] = useState("");
  const [userEvents, setUserEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const generateQRCode = async (text) => {
    try {
      const dataURL = await QRCode.toDataURL(text);
      // console.log(dataURL);
      setQRCodeDataURL(dataURL);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  // const downloadQRCode = () => {
  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = qrCodeDataURL;
  //   downloadLink.download = "qrcode.png";
  //   downloadLink.click();
  // };

  useEffect(() => {
    // console.log("Hi");
    axios
      .post(baseURL + "/check-loggedin", {
        id: localStorage.getItem("id"),
      })
      .then((res) => {
        // console.log(res);
        return res["data"];
      })
      .then((res) => {
        // console.log(res);

        if (res["logged_in"]) {
          setUser(res);
          if (res.concert != null) {
            generateQRCode(res.concert);
          }
        } else {
          navigate("/auth");
        }
      });

    axios
      .post(baseURL + "/userEvents", {
        userId: localStorage.getItem("id"),
      })
      .then((res) => res["data"])
      .then((res) => {
        // console.log(res);
        setUserEvents(res.events);
      });
    setLoading(false);
  }, []);

  return (
    <div className="Profile">
      <img src={kcg25} className="AllKcg25" alt="kcg25" />

      {loading ? (
        <icons.Loading />
      ) : (
        <>
          <div className="profileBg">
            {/* <Spline
          id="spline"
          scene="https://prod.spline.design/1CXBumz9jWVu325v/scene.splinecode"
        /> */}
            {/* <div className="logo">
          <img src={logo} alt="logo" />
        </div> */}
            {/* <video className="ProfileVid" src={vid} autoPlay muted loop></video> */}
            <video className="ProfileVid" autoPlay muted loop>
              <source src={vid} type="video/webm" autoPlay muted loop></source>
              {/* <source src={vid2} type="video/mp4" autoPlay muted loop></source> */}
            </video>
          </div>
          <div className="content">
            {user.logged_in && (
              <div className="profileScreen">
                <div className="box">
                  {/* <div className="dummy"></div> */}
                  <div className="left">
                    <div className="profile">
                      <h1>Profile</h1>

                      <div className="prow">
                        <h2>Name</h2>
                        <p>{user.name}</p>
                      </div>
                      <div className="prow">
                        <h2>College</h2>
                        <p>{user.college}</p>
                      </div>
                      {user.isInnerCollege && (
                        <div className="prow">
                          <h2>Department</h2>
                          <p>{user.department}</p>
                        </div>
                      )}
                      {user.isInnerCollege && (
                        <div className="prow">
                          <h2>Year</h2>
                          <p>{user.year}</p>
                        </div>
                      )}

                      <div className="prow">
                        <h2>Email</h2>
                        <p>
                          {/* {user.email.length > 21
                        ? user.email.slice(0, 21) + "..."
                        : user.email} */}
                          {user.email}
                        </p>
                        {/* <p>{"20ad09@kcgcollege.com"}</p> */}
                      </div>
                    </div>
                    <div className="events">
                      <h1>Events particitipating</h1>
                      {userEvents.length > 0 ? (
                        userEvents.map((event, key) => (
                          <p
                            key={key}
                            onClick={() => {
                              navigate("/event/" + event.event);
                            }}
                          >
                            {
                              events.filter(
                                (ev) => ev.eventId == event.event
                              )[0].name
                            }
                          </p>
                        ))
                      ) : (
                        <p>No events yet</p>
                      )}
                      <button
                        className="pb"
                        onClick={() => {
                          navigate("/events");
                        }}
                      >
                        Participate in events
                      </button>
                    </div>
                  </div>
                  <div className="right">
                    <div className="rsec">
                      <h1>Ethereal Access</h1>
                      {user.ethereal !== null ? (
                        <p className="code">Code: {user.ethereal}</p>
                      ) : (
                        <p className="buyP">Buy Ethereal tickets</p>
                      )}
                    </div>
                    <div className="rsec">
                      <h1>Concert Access</h1>

                      <div className="qr">
                        {qrCodeDataURL != "" ? (
                          <>
                            <img src={qrCodeDataURL} alt="qrCodeDataURL" />
                            {/* <button
                          className="downloadQR"
                          onClick={() => {
                            downloadQRCode();
                          }}
                        >
                          Download
                        </button> */}
                          </>
                        ) : (
                          <p className="buyP">
                            Buy concert ticket <br />
                            to get access
                          </p>
                        )}
                      </div>
                      {user.concert_code !== null ? (
                        <p className="code">Code: {user.concert_code}</p>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
