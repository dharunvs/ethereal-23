import React, { useEffect, useState } from "react";
// import logo from "../../Assets/Images/logo.png";
import vid from "../../Assets/Spline/gradient-waves.webm";
import axios from "axios";
import { baseURL } from "../../data";
import { useNavigate } from "react-router-dom";
import { icons } from "../../Assets/Icons";

import "./LoggedIn.css";
// import ethPoster from "../../Assets/Images/ethPoster.png";
// import conPoster from "../../Assets/Images/Pradeep2.png";

function LoggedIn() {
  const [loading, setLoading] = useState(true);
  const Loader = () => <icons.Loading />;

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

  const [paused, setPaused] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [CBannerActive, setCBannerActive] = useState(false);
  const [EBannerActive, setEBannerActive] = useState(false);
  const [conSelected, setConSelected] = useState(false);
  const [ethSelected, setEthSelected] = useState(false);
  const [comboSelected, setComboSelected] = useState(false);
  const [innerClg, setInnerClg] = useState(false);
  const [comboEligible, setComboEligible] = useState(false);
  const [eth, setEth] = useState(false);
  const [con, setCon] = useState(false);
  const [fees, setFees] = useState({});

  useEffect(() => {
    axios(baseURL + "/config")
      .then((res) => res.data)
      .then((res) => {
        // console.log(res);
        setPaused(res.pause_payments);
      });

    axios
      .get(baseURL + "/get-fees")
      .then((res) => res.data)
      .then((res) => {
        // console.log(res);
        setFees(res);
      });

    axios
      .post(baseURL + "/check-loggedin", {
        id: localStorage.getItem("id"),
      })
      .then((res) => res["data"])
      .then((res) => {
        // // console.log(res);
        if (res["logged_in"]) {
          setLoggedIn(true);
          setInnerClg(res["isInnerCollege"]);
          setComboEligible(
            res["combo_eligible"] == null ? false : res["combo_eligible"]
          );
          if (res["ethereal"] === null || res["ethereal"] === undefined) {
            setEth(false);
          } else {
            setEth(true);
          }
          if (res["concert"] === null || res["concert"] === undefined) {
            setCon(false);
          } else {
            setCon(true);
          }
          // setComboEligible(true);
        } else {
          navigate("/auth");
        }
        setLoading(false);
      });

    // setTimeout(() => {
    // }, 1000);
  }, []);

  return (
    <div className="LoggedIn">
      <div className="LIbg">
        {/* <Spline
          id="spline"
          scene="https://prod.spline.design/1CXBumz9jWVu325v/scene.splinecode"
        /> */}
        {/* <div className="logo">
          <img src={logo} alt="logo" />
        </div> */}
        <video className="LoggedInVid" src={vid} autoPlay muted loop></video>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="content">
          {/* <div
          className={
            CBannerActive && EBannerActive
              ? "CBannerActiveHalf"
              : CBannerActive
              ? "CBannerActive"
              : "CBanner"
          }
        >
          <div className="img">
            <img src={conPoster} alt="" />
          </div>
        </div>
        <div
          className={
            CBannerActive && EBannerActive
              ? "EBannerActiveHalf"
              : EBannerActive
              ? "EBannerActive"
              : "EBanner"
          }
        >
          <div className="img">
            <img src={ethPoster} alt="ethPoster" />
          </div>
        </div> */}
          {loggedIn &&
            (!paused ? (
              <div className="AuthScreen">
                <div className="box">
                  <h1>Welcome {innerClg ? "KCGian" : ""}</h1>
                  <div>
                    <button
                      onMouseEnter={() => {
                        setEBannerActive(true);
                      }}
                      onMouseLeave={() => {
                        setEBannerActive(false);
                      }}
                      disabled={comboEligible}
                      className={ethSelected ? "sel" : "sel2"}
                      onClick={(e) => {
                        // // console.log(e.target.disabled);
                        if (!innerClg) {
                          setEthSelected(!ethSelected);
                          if (eth) {
                            setEthSelected(false);
                          }
                          if (conSelected) {
                            setEthSelected(false);
                            setConSelected(false);
                            setComboSelected(true);
                          }

                          if (comboSelected) {
                            setComboSelected(false);
                          }
                        } else {
                          setEthSelected(!ethSelected);
                          if (eth) {
                            setEthSelected(false);
                          }
                        }
                      }}
                    >
                      {eth && <p>Bought!</p>}
                      <h2 className={eth ? "bought" : ""}>
                        Ethereal <br /> + DJ <br />
                        <div
                          style={{
                            width: "100%",
                            height: "10px",
                          }}
                        ></div>
                        {fees.ethereal}/-
                      </h2>
                    </button>
                    {!eth && !con && !innerClg && (
                      <button
                        onMouseEnter={() => {
                          setEBannerActive(true);
                          setCBannerActive(true);
                        }}
                        onMouseLeave={() => {
                          setCBannerActive(false);
                          setEBannerActive(false);
                        }}
                        className={comboSelected ? "sel" : "sel2"}
                        onClick={() => {
                          // setComboSelected(!comboSelected);
                          if (comboSelected) {
                            setComboSelected(false);
                          } else {
                            setComboSelected(true);
                            setEthSelected(false);
                            setConSelected(false);
                          }
                        }}
                      >
                        {con && eth && <p>Bought!</p>}
                        <h2 className={con ? "bought" : ""}>
                          Ethereal + DJ <br /> + Concert
                          <div
                            style={{
                              width: "100%",
                              height: "10px",
                            }}
                          ></div>
                          {fees.oc_combo}/-
                        </h2>
                      </button>
                    )}
                    <button
                      onMouseEnter={() => {
                        setCBannerActive(true);
                      }}
                      onMouseLeave={() => {
                        setCBannerActive(false);
                      }}
                      className={conSelected ? "sel" : "sel2"}
                      onClick={() => {
                        if (!innerClg) {
                          setConSelected(!conSelected);
                          if (con) {
                            setConSelected(false);
                          }

                          if (ethSelected) {
                            setEthSelected(false);
                            setConSelected(false);
                            setComboSelected(true);
                          }

                          if (comboSelected) {
                            setComboSelected(false);
                          }
                        } else {
                          setConSelected(!conSelected);
                          if (con) {
                            setConSelected(false);
                          }
                        }
                      }}
                    >
                      {con && <p>Bought!</p>}
                      <h2 className={con ? "bought" : ""}>
                        Concert <br />
                        <div
                          style={{
                            width: "100%",
                            height: "10px",
                          }}
                        ></div>
                        {innerClg
                          ? comboEligible
                            ? fees.ic_concert - fees.ethereal
                            : fees.ic_concert
                          : fees.oc_concert}
                        /-
                      </h2>
                    </button>
                  </div>
                  <p className="cInf">
                    Concert only for college students <br /> ID proof compulsory
                  </p>

                  <button
                    className="btButton"
                    onClick={() => {
                      localStorage.setItem(
                        "payment",
                        // conSelected & ethSelected
                        //   ? 3
                        //   : ethSelected
                        //   ? 1
                        //   : conSelected
                        //   ? 2
                        //   : 0
                        ethSelected && conSelected
                          ? innerClg
                            ? "IC_BOTH"
                            : "OC_BOTH"
                          : ethSelected
                          ? "ETHEREAL"
                          : conSelected
                          ? innerClg
                            ? comboEligible
                              ? "IC_COMBO_CONCERT"
                              : "IC_CONCERT"
                            : "OC_CONCERT"
                          : comboSelected
                          ? innerClg
                            ? ""
                            : "OC_COMBO"
                          : ""
                      );
                      if (conSelected | ethSelected | comboSelected) {
                        navigate("/checkout");
                      }
                    }}
                  >
                    Buy Tickets
                  </button>
                </div>
              </div>
            ) : (
              <h1 className="paused">
                Bookings paused temporarily <br />
                Stay tuned
              </h1>
            ))}
        </div>
      )}
    </div>
  );
}

export default LoggedIn;
