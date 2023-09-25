import React, { useEffect, useState } from "react";
import "./Checkout.css";
// import logo from "../../Assets/Images/logo.png";
import vid from "../../Assets/Spline/gradient-waves.webm";
// import img from "../../Assets/Images/Pradeep.png";
import axios from "axios";
import { baseURL, events } from "../../data";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
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

  const [etActive, setEtActive] = useState(false);
  const [type, setType] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showET, setShowET] = useState(false);
  const [showNote, setShowNote] = useState(true);
  const [transactionId, setTransactionId] = useState("");
  const [qr, setQr] = useState(null);
  const [total, setTotal] = useState("he");
  const [fees, setFees] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [red, setRed] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(baseURL + "/get-fees")
      .then((res) => res.data)
      .then((res) => {
        setFees(res);
      });
  }, []);

  let selEvents = [];

  function CountdownTimer() {
    const [count, setCount] = useState(5);

    useEffect(() => {
      const timer = setInterval(() => {
        if (count > 0) {
          setCount(count - 1);
        } else {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }, [count]);

    return (
      <div>
        {count === 0 ? (
          <button
            className="qrNoteBtn"
            onClick={() => {
              setShowNote(false);
            }}
          >
            Reveal QR
          </button>
        ) : (
          <button className="qrNoteBtn">{count}</button>
        )}
      </div>
    );
  }

  // autoPlay muted loop

  useEffect(() => {
    const type1 = localStorage.getItem("payment");
    setType(type1);

    // ethereal: 350,
    // ic_combo_concert: 550,
    // oc_combo_concert: 1199,
    // ic_concert: 900,
    // oc_concert: 1099

    switch (type1) {
      case "ETHEREAL":
        setTotal(350);
        break;
      case "IC_BOTH":
        setTotal(1250);
        break;
      case "IC_COMBO_CONCERT":
        setTotal(550);
        break;
      case "IC_CONCERT":
        setTotal(900);
        break;
      case "OC_BOTH":
        setTotal(1199);
        break;
      case "OC_COMBO":
        setTotal(1199);
        break;
      case "OC_CONCERT":
        setTotal(1099);
        break;
      default:
        setTotal(null);
        break;
    }

    axios
      .get(baseURL + "/getQR/" + localStorage.getItem("payment"), {
        responseType: "arraybuffer",
      })
      .then((response) => {
        // Convert the binary data to a base64 string
        const imageBase64 = btoa(
          new Uint8Array(response.data).reduce((data, byte) => {
            return data + String.fromCharCode(byte);
          }, "")
        );

        // Set the image source
        setQr(`data:image/jpeg;base64,${imageBase64}`);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }, []);

  const handlePayment = () => {
    const body = {
      email: localStorage.getItem("email"),
      type: localStorage.getItem("payment"),
      events: selEvents,
      comboEligible: localStorage.getItem("comboEligible"),
    };
    axios
      .post(baseURL + "/initiateTransaction", body)
      .then((res) => res.data)
      .then((res) => {
        window.location.href = res.url;
      });
  };

  const EventsTab = () => {
    const Event = ({ val }) => {
      const [inSel, setInSel] = useState(false);
      return (
        <div
          className={inSel ? "EvSel" : "Ev"}
          onClick={() => {
            setInSel(!inSel);

            if (inSel) {
              selEvents = selEvents.filter((item) => item !== val.name);
            } else {
              selEvents = [...selEvents, val.name];
            }
            heckout;
          }}
        >
          <p>{val.name}</p>
          <div className="bd"></div>
        </div>
      );
    };
    return (
      <div className="EventsTab">
        <div
          className="back"
          onClick={() => {
            setEtActive(!etActive);
            if (!showET) {
              setTimeout(() => {
                setShowET(!showET);
              }, 200);
            } else {
              setShowET(!showET);
            }
          }}
        >
          <h1>{"<-"}</h1>
        </div>
        <div className="container">
          <h1>Select Events</h1>

          {events.map((val, key) => (
            <Event val={val} key={key} />
          ))}
        </div>
      </div>
    );
  };

  // const ConItem = () => {
  //   return (
  //     <div className="ConItem">
  //       <h1>Concert</h1>
  //       <img src={img} alt="" />
  //     </div>
  //   );
  // };

  const EthItem = () => {
    return (
      <div className="EthItem">
        <h1>Ethereal</h1>
        {/* <VideoPlayer /> */}
        <video className="EIvid" src={ethVidd} autoPlay muted loop></video>
        <div>
          {/* <button
            onClick={() => {
              setEtActive(!etActive);
              if (!showET) {
                setTimeout(() => {
                  setShowET(!showET);
                }, 200);
              } else {
                setShowET(!showET);
              }
            }}
          >
            Participate in events
          </button> */}
        </div>
      </div>
    );
  };

  const PostSubmit = ({ mes }) => {
    let message = mes.message.trim();
    return (
      <div className="PostSubmit">
        {message == "Success" ? (
          <>
            <h1>Thank you</h1>
            <p>
              Verification under process, Check back after 6hrs,
              <br />
              Thank you !
            </p>
            <button
              onClick={() => {
                navigate("/events");
              }}
            >
              View events
            </button>
          </>
        ) : message == "Failure" ? (
          <>
            <h1>Oops !</h1>
            <p>Some error occured</p>
            <button
              onClick={() => {
                navigate("/home");
              }}
            >
              Try again
            </button>
          </>
        ) : message == "Already Submitted" ? (
          <>
            <h1>Verification Pending</h1>

            <p>
              You have already submitted the <br /> Transaction ID {mes.tid}{" "}
              <br /> <br />
              You will recieve your tickets once the transaction is verified,{" "}
            </p>
            <button
              onClick={() => {
                navigate("/events");
              }}
            >
              View events
            </button>
          </>
        ) : (
          <>
            {" "}
            <h1>Oops !</h1>
            <p>{mes.message}</p>
            <button
              onClick={() => {
                navigate("/home");
              }}
            >
              Try again
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="Checkout">
      <div className="checkoutBg">
        {/* <Spline
          id="spline"
          scene="https://prod.spline.design/1CXBumz9jWVu325v/scene.splinecode"
        /> */}
        {/* <div className="logo"><img src={logo} alt="logo" /></div> */}
        <video className="AuthVid" src={vid} autoPlay muted loop></video>
      </div>
      {/* <div className="content">
        <div className="CheckoutScreen">
          <div className="box">
            <div className="box2">
              <div className={etActive ? "ckItemsA" : "ckItems"}>
                {

                  type == 1 ? (
                    <EthItem />
                  ) : type == 2 ? (
                    <ConItem />
                  ) : type == 3 ? (
                    <>
                      <ConItem />
                      <EthItem />{" "}
                    </>
                  ) : (
                    <></>
                  )
                  
                }

              </div>

   


            </div>

            <button
              className="btButton"
              onClick={() => {
                handlePayment();
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div> */}
      <div className="content1">
        {!submitted ? (
          <div className="qrBox">
            <div className="QR">
              <div className={showNote ? "qrNote" : "qrNoteO"}>
                <p>
                  <span>Important !</span> <br /> <br /> You will have to submit
                  the transaction ID to process your ticket{"(s)"}
                  <br />
                </p>
                <CountdownTimer />
              </div>
              <img src={qr} alt="qrImage" />
            </div>
            <div className="products">
              {type == "ETHEREAL" ? (
                <>
                  <div className="pRow">
                    <p>Ethereal</p>
                    <p>₹ 350</p>
                  </div>
                </>
              ) : type == "IC_BOTH" ? (
                <>
                  <div className="pRow">
                    <p>Ethereal</p>
                    <p>₹ 350</p>
                  </div>
                  <div className="pRow">
                    <p>Concert</p>
                    <p>₹ 900</p>
                  </div>
                </>
              ) : type == "IC_COMBO_CONCERT" ? (
                <>
                  <div className="pRow">
                    <p>Concert</p>
                    <p>₹ 550</p>
                  </div>
                </>
              ) : type == "IC_CONCERT" ? (
                <>
                  <div className="pRow">
                    <p>Concert</p>
                    <p>₹ 900</p>
                  </div>
                </>
              ) : type == "OC_BOTH" ? (
                <>
                  {" "}
                  <div className="pRow">
                    <p>Ethereal</p>
                    <p>₹ 350</p>
                  </div>
                  <div className="pRow">
                    <p>Concert</p>
                    <p>₹ 849</p>
                  </div>
                </>
              ) : type == "OC_COMBO" ? (
                <>
                  {" "}
                  <div className="pRow">
                    <p>Ethereal</p>
                    <p>₹ 350</p>
                  </div>
                  <div className="pRow">
                    <p>Concert</p>
                    <p>₹ 849</p>
                  </div>
                </>
              ) : type == "OC_CONCERT" ? (
                <>
                  {" "}
                  <div className="pRow">
                    <p>Concert</p>
                    <p>₹ 1099</p>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div className="pRow">
                <p>Sub Total</p>
                <p>₹ {total}</p>
              </div>
              <p className="line"></p>

              <div className="pRow">
                <p>Convenience fee</p>
                <p>₹ 10</p>
              </div>
              <p className="line"></p>
              <div className="pRow">
                <p>Total</p>
                <p className="prpBold">₹ {total + 10}</p>
              </div>
            </div>
            <input
              type="number"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="UPI Transaction Id*"
              required
              className={red ? "red" : ""}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                if (transactionId.trim() !== "") {
                  axios
                    .post(baseURL + "/transaction", {
                      userId: localStorage.getItem("id"),
                      transactionId: transactionId,
                      type: type,
                    })
                    .then((res) => res.data)
                    .then((res) => {
                      // console.log(res);
                      if (res.message == undefined) {
                        setMessage({ message: "Failure" });
                      } else {
                        setMessage(res);
                      }
                      setSubmitted(true);
                    });
                } else {
                  setRed(true);
                }
              }}
            >
              Submit
            </button>
          </div>
        ) : (
          <PostSubmit mes={message} />
        )}
      </div>
    </div>
  );
}

export default Checkout;
