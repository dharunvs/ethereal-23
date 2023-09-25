import React from "react";
import { useState, useEffect } from "react";
// import logo from "../../Assets/Images/logo.png";
import vid from "../../Assets/Spline/gradient-waves.webm";
import axios from "axios";
import { baseURL, colleges } from "../../data";
import { useNavigate } from "react-router-dom";
import { icons } from "../../Assets/Icons";

import "./Auth.css";

function Auth() {
  const [loading, setLoading] = useState(true);
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

  const navigate = useNavigate();
  const [level, setLevel] = useState(1);
  const [innerClg, setInnerClg] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(null);

  function isInnerCollege(email) {
    const emailParts = email.split("@");
    if (emailParts[emailParts.length - 1] === "kcgcollege.com") {
      return true;
    }
    return false;
  }

  function validateEmail(email) {
    // Regular expression for a basic email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Test the email against the regular expression
    if (emailRegex.test(email)) {
      return true; // Valid email
    } else {
      return false; // Invalid email
    }
  }

  useEffect(() => {
    // console.log(localStorage.getItem("id"));
    axios
      .post(baseURL + "/check-loggedin", {
        id: localStorage.getItem("id"),
      })
      .then((res) => res["data"])
      .then((res) => {
        // console.log(res);
        if (res["logged_in"]) {
          // setLoggedIn(true);
          navigate("/home");
        } else {
          navigate("/auth");
        }
      });
    setLoading(false);
  }, []);

  const Form1 = () => {
    const [inEmail, setInEmail] = useState(email);

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Prevent the default Enter key behavior
          }
        }}
      >
        <h1>Login</h1>
        <input
          type="text"
          value={inEmail}
          onChange={(e) => setInEmail(e.target.value.toLocaleLowerCase())}
          required
          placeholder="Email"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            if (validateEmail(inEmail)) {
              axios
                .post(baseURL + "/check-new", {
                  email: inEmail,
                })
                .then((res) => res["data"])
                .then((res) => {
                  if (res["message"] == "NewUser") {
                    setInnerClg(isInnerCollege(inEmail));
                    setEmail(inEmail);
                    setLevel(2);
                  } else if (res["message"] == "OldUser") {
                    setEmail(inEmail);
                    axios
                      .post(baseURL + "/send-otp", {
                        email: inEmail !== "" ? inEmail : email,
                      })
                      .then((res) => res["data"])
                      .then((res) => {
                        // console.log(res["ok"]);
                        if (res["ok"]) {
                          setLevel(3);
                        }
                      });
                  }
                });
            }
          }}
          disabled={!validateEmail(inEmail)}
        >
          Next
        </button>
      </form>
    );
  };

  // function ResendOtp() {
  //   const [count, setCount] = useState(15);

  //   useEffect(() => {
  //     const timer = setInterval(() => {
  //       if (count > 0) {
  //         setCount(count - 1);
  //       } else {
  //         clearInterval(timer);
  //       }
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }, [count]);

  //   return (
  //     <div>
  //       {count === 0 ? (
  //         <button
  //           onClick={() => {
  //             setShowNote(false);
  //           }}
  //         >
  //           Reveal QR
  //         </button>
  //       ) : (
  //         <button className="qrNoteBtn"> Resend {count}</button>
  //       )}
  //     </div>
  //   );
  // }

  const NewUserForm = () => {
    const [inEmail, setInEmail] = useState(email);
    const [inName, setInName] = useState("");
    const [inPhone, setInPhone] = useState("");
    const [inClg, setInCollege] = useState(
      innerClg ? "KCG College Of Technology" : ""
    );
    const [message, setMessage] = useState("");
    const [filteredColleges, setFilteredColleges] = useState(colleges);
    const [showColleges, setShowColleges] = useState(false);

    const handleSearch = (searchTerm) => {
      const filtered = colleges.filter((clg) =>
        clg
          .replace(/[ .]/g, "")
          .toLowerCase()
          .includes(searchTerm.replace(/[ .]/g, "").toLowerCase())
      );
      setFilteredColleges(filtered);
    };

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Prevent the default Enter key behavior
          }
        }}
      >
        <h1>Login</h1>
        <input
          type="text"
          required
          value={inName}
          onChange={(e) => setInName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="email"
          required
          value={inEmail}
          onChange={(e) => setInEmail(e.target.value)}
          placeholder="Email"
          disabled={true}
        />
        <input
          type="number"
          required
          value={inPhone}
          onChange={(e) => setInPhone(e.target.value)}
          placeholder="Phone"
        />
        <div>
          <input
            type="text"
            required
            value={inClg}
            onChange={(e) => {
              setInCollege(e.target.value);
              if (e.target.value.trim() !== "") {
                setShowColleges(true);
              } else {
                setShowColleges(false);
              }
              handleSearch(e.target.value);
            }}
            placeholder="College"
            disabled={isInnerCollege(email)}
          />
          {showColleges ? (
            <div className="colleges">
              {filteredColleges.length > 0 ? (
                filteredColleges.map((val, key) => (
                  <p
                    key={key}
                    onClick={() => {
                      setInCollege(val);
                      setShowColleges(false);
                    }}
                  >
                    {val}
                  </p>
                ))
              ) : (
                <p
                  className="newCollegeBt"
                  onClick={() => {
                    setInCollege(inClg);
                    setShowColleges(false);
                  }}
                >
                  {inClg} <span>{" (Add College)"}</span>
                </p>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>

        <p className="fMsg">{message}</p>
        <div className="NUFbts">
          <button
            onClick={() => {
              setInName("");
              setInPhone("");
              setLevel(1);
            }}
          >
            Back
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              {
                inEmail.trim() !== "" &&
                inName.trim() !== "" &&
                inPhone.trim() !== "" &&
                inClg.trim() !== ""
                  ? axios
                      .post(baseURL + "/send-otp", {
                        name: inName,
                        email: inEmail !== "" ? inEmail : email,
                        phone: inPhone,
                        college: inClg,
                      })
                      .then((res) => res["data"])
                      .then((res) => {
                        // console.log(res["ok"]);
                        if (res["ok"]) {
                          setOtpSent(false);
                          setLevel(3);
                        } else {
                          setOtpSent(false);
                        }
                      })
                  : setMessage("All fields required");
              }
            }}
          >
            Next
          </button>
        </div>
      </form>
    );
  };

  const OtpForm = () => {
    const [inOTP, setInOTP] = useState("");
    const [otpMsg, setOtpMsg] = useState(`OTP has been sent to ${email}`);
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Prevent the default Enter key behavior
          }
        }}
      >
        <h1>Login</h1>
        <div>
          {/* {otpSent == true ? (
            <p className="colorGreen">OTP has been sent to {email} </p>
          ) : otpSent == false ? (
            <p className="colorRed">Failed to send OTP to {email} </p>
          ) : (
            <p className="colorWhite">Sending OTP to {email}</p>
          )} */}
          <p className="colorGreen">{otpMsg}</p>

          <input
            type="number"
            required
            placeholder="OTP"
            value={inOTP}
            onChange={(e) => setInOTP(e.target.value)}
          />
        </div>
        <button
          onClick={(e) => {
            if (inOTP.trim() !== "") {
              e.preventDefault();
              axios
                .post(baseURL + "/login", {
                  email: email,
                  otp: inOTP,
                })
                .then((res) => res["data"])
                .then((res) => {
                  // console.log(res);
                  localStorage.setItem("id", res["id"]);
                  localStorage.setItem("email", res["email"]);
                  localStorage.setItem("loggedIn", res["loggedIn"]);
                })
                .then(() => {
                  navigate("/home");
                })
                .catch((err) => {
                  setOtpMsg(err.response.data.message);
                });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent the default Enter key behavior
            }
          }}
        >
          Login
        </button>
      </form>
    );
  };

  return (
    <div className="Auth">
      {loading ? (
        <icons.Loading />
      ) : (
        <>
          {" "}
          <div className="authBg">
            {/* <Spline
          id="spline"
          scene="https://prod.spline.design/1CXBumz9jWVu325v/scene.splinecode"
        /> */}
            {/* <div className="logo">
          <img src={logo} alt="logo" />
        </div> */}
            <video
              className="AuthVid"
              src={vid}
              type="video/webm"
              autoPlay
              muted
              loop
            ></video>
          </div>
          <div className="content">
            <div className="AuthScreen">
              {level == 1 ? (
                <Form1 />
              ) : level == 2 ? (
                <NewUserForm />
              ) : level == 3 ? (
                <OtpForm />
              ) : (
                <Form1 />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Auth;
