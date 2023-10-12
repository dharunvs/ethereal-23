import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL, events } from "../../data";
import vid from "../../Assets/Spline/cubes.webm";
// import eventImg from "../../Assets/Images/event.jpeg";
import "./EventPage.css";
import { posterImg } from "../../Assets/Images/posters";
import { icons } from "../../Assets/Icons";
import axios from "axios";
import { posterRules } from "../../Assets/Images/rules";

function EventPage() {
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

  const { id } = useParams();
  const navigate = useNavigate();

  const [initialLoading, setInitialLoading] = useState(true);

  const [event, setEvent] = useState({});
  const [registered, setRegistered] = useState(false);
  const [team, setTeam] = useState("");
  const [solo, setSolo] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [ethereal, setEthereal] = useState(true);
  const [etherealNew, setEtherealNew] = useState(false);
  const [newTeam, setNewTeam] = useState(false);
  const [oldTeam, setOldTeam] = useState(false);
  const [oldTeamVal, setOldTeamVal] = useState({});

  const [rules, setRules] = useState({ page: 1, img: posterRules[id] });
  const [rulesShow, setRulesShow] = useState(false);

  const [mes, setMes] = useState("");

  const [oText, setOText] = useState("");

  useEffect(() => {
    axios
      .post(baseURL + "/check-loggedin", {
        id: localStorage.getItem("id"),
      })
      .then((res) => res["data"])
      .then((res) => {
        if (res["logged_in"]) {
          setLoggedIn(true);
          if (res["ethereal"] !== undefined) setEthereal(res["ethereal"]);
          if (res["ethereal"] !== undefined) setEtherealNew(res["ethereal"]);
          setEthereal(true);
        }
      });

    const selEvent = events.find((event) => event.eventId === id);
    // console.log(selEvent);
    setEvent(selEvent);

    if (selEvent.min == 1 && selEvent.max == 1) {
      setSolo(true);
    } else setSolo(false);

    axios
      .post(baseURL + "/events", {
        userId: localStorage.getItem("id"),
        eventId: id,
      })
      .then((res) => res["data"])
      .then((res) => {
        // console.log(res);
        if (res.found) {
          setRegistered(true);
          setTeam(res.team);
        } else {
          setRegistered(false);
        }
      });
  }, []);

  const GetTeam = ({ team }) => {
    const [members, setMembers] = useState([]);
    const [lead, setLead] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // console.log(team.members);

      if (team.members != null) {
        axios
          .post(baseURL + "/users", { ids: team.members })
          .then((res) => res.data)
          .then((res) => {
            setMembers(res.userIds);
            // console.log(res.userIds);
          });
      }
      if (team.lead != null) {
        axios
          .post(baseURL + "/users", { ids: [team.lead] })
          .then((res) => res.data)
          .then((res) => {
            setLead(res.userIds[0]);
            // console.log(res.userIds[0]);
          })
          .then(() => {
            setLoading(false);
          });
      }
    }, []);

    return (
      <>
        {loading ? (
          <div className="Team" style={{}}>
            <icons.Loading className2="TeamLoadersvg" />
          </div>
        ) : (
          <div className="Team">
            <h2>{team.name}</h2>
            <div className="members">
              <div className="memrow">
                <div className="verified">
                  <div className={lead.verified ? "dotGreen" : "dotRed"}></div>
                </div>
                <p className="memName">
                  {lead.name} {lead.id == localStorage.getItem("id") && "(You)"}
                </p>
                <p></p>
                <p className="leadbut">
                  {lead.id == localStorage.getItem("id") ? "Lead" : "Lead"}
                </p>
              </div>
              {/* <div className="memrow">
            <p className="memName">Hrithik M Joseph Sivakumar</p>
            <p></p>
            <p className="rmbut">Remove</p>
          </div> */}

              {members.length > 0 &&
                members.map((member, key) => (
                  <div key={key} className="memrow">
                    <div className="verified">
                      <div
                        className={member.verified ? "dotGreen" : "dotRed"}
                      ></div>
                    </div>

                    <p className="memName">
                      {member.name}{" "}
                      {member.id == localStorage.getItem("id") && "(You)"}
                    </p>
                    <p></p>
                    {lead.id == localStorage.getItem("id") ? (
                      <p
                        className="rmbut"
                        onClick={() => {
                          handleRemove(team.id, member.id);
                        }}
                      >
                        Remove
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const ConfirmTeam = ({ team }) => {
    const [members, setMembers] = useState([]);
    const [lead, setLead] = useState("");

    useEffect(() => {
      // console.log(team);

      if (team.members != null) {
        axios
          .post(baseURL + "/users", { ids: team.members })
          .then((res) => res.data)
          .then((res) => {
            setMembers(res.userIds);
            // console.log(res.userIds);
          });
      }
      if (team.lead != null) {
        axios
          .post(baseURL + "/users", { ids: [team.lead] })
          .then((res) => res.data)
          .then((res) => {
            setLead(res.userIds[0]);
            // console.log(res.userIds[0]);
          });
      }
    }, []);

    return (
      <div className="Team">
        <h2>{team.name}</h2>
        <div className="members">
          <div className="memrow">
            <div className="verified"></div>
            <p className="memName">{lead.name}</p>
            <p></p>
            <p className="leadbut">Lead</p>
          </div>

          {members.length > 0 &&
            members.map((member, key) => (
              <div key={key} className="memrow">
                <div className="verified"></div>

                <p className="memName">{member.name}</p>
                {/* <p></p> */}
              </div>
            ))}
        </div>
      </div>
    );
  };

  const PostTeam = () => {
    // const teams = ["Legend", "Centigrade"];
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [text, setText] = useState("");
    const [showTeams, setShowTeams] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState("");

    useEffect(() => {
      axios
        .post(baseURL + "/events/" + id, {
          userId: localStorage.getItem("id"),
        })
        .then((res) => res.data)
        .then((res) => {
          setTeams(res);
        });
    }, []);

    useEffect(() => {
      setText(oText);
    }, [location.pathname]);

    const handleSearch = (searchTerm) => {
      const filtered = teams.filter((team) =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeams(filtered);
    };

    return (
      <div className="PostTeam">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value.trim() !== "") {
              setShowTeams(true);
            } else {
              setShowTeams(false);
            }
            handleSearch(e.target.value);
          }}
          placeholder="Team name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent the default Enter key behavior
            }
          }}
        />
        {showTeams ? (
          <div className="availTeams">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((val, key) => (
                <p
                  key={key}
                  onClick={() => {
                    setSelectedTeam(val.name);
                    setText(val.name);
                    setShowTeams(false);
                    setNewTeam(false);
                    setOldTeam(true);
                    setOldTeamVal(val);
                  }}
                >
                  {val.name}
                </p>
              ))
            ) : (
              <p
                className="newTeamBT"
                onClick={() => {
                  setSelectedTeam(text);
                  setText(text);
                  setShowTeams(false);
                  setNewTeam(true);
                  setOText(text);
                  setOldTeam(false);
                }}
              >
                {text} <span>{" (New Team)"}</span>
              </p>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  };

  function handleRegister() {
    // console.log(baseURL + "/events/" + id + "/register");
    if (oText.trim() !== "" || solo) {
      axios
        .post(baseURL + "/events/" + id + "/register", {
          userId: localStorage.getItem("id"),
          teamName: oText,
          solo: solo,
        })
        .then((res) => res["data"])
        .then((res) => {
          console.log("-1", res);
          if (res["message"] == "Hello") {
            axios
              .post(baseURL + "/events", {
                userId: localStorage.getItem("id"),
                eventId: id,
              })
              .then((res) => res["data"])
              .then((res) => {
                console.log("-2", res);
                if (res.found) {
                  setRegistered(true);
                  setTeam(res.team);
                } else {
                  setRegistered(false);
                }
              });
          } else {
            if (res["message"] == "Team already exists with same name") {
              // console.log(res["message"]);
              setMes(res["message"]);
            }
          }
        });
    }
  }

  function handleJoin() {
    axios
      .post(baseURL + "/events/" + id + "/join", {
        userId: localStorage.getItem("id"),
        team: oldTeamVal,
      })
      .then((res) => res.data)
      .then((res) => {
        // console.log(res);
        axios
          .post(baseURL + "/events", {
            userId: localStorage.getItem("id"),
            eventId: id,
          })
          .then((res) => res["data"])
          .then((res) => {
            // console.log(res);
            if (res.found) {
              setRegistered(true);
              setTeam(res.team);
            } else {
              setRegistered(false);
            }
          });
      });
  }

  function handleRemove(teamId, memberId) {
    axios
      .post(baseURL + "/events/" + id + "/remove", {
        teamId: teamId,
        memberId: memberId,
      })
      .then((res) => {
        axios
          .post(baseURL + "/events", {
            userId: localStorage.getItem("id"),
            eventId: id,
          })
          .then((res) => res["data"])
          .then((res) => {
            // console.log(res);
            if (res.found) {
              setRegistered(true);
              setTeam(res.team);
            } else {
              setRegistered(false);
            }
          });
      });
  }

  function cw(str) {
    str = str.toLowerCase();
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }

  return (
    <div className="EventPage">
      <div className="left">
        <img src={posterImg[id]} className="epPoster" alt="eventImg" />
        {rulesShow ? (
          <div className="rules">
            <img src={rules.img} alt="posterRules" />
            {event.rules > 1 && (
              <>
                <button
                  className="rulesButton1"
                  onClick={() => {
                    setRules({ page: 1, img: posterRules[id.toString()] });
                  }}
                >
                  Page 1
                </button>

                <button
                  className="rulesButton2"
                  onClick={() => {
                    setRules({
                      page: 2,
                      img: posterRules[id.toString() + "_2"],
                    });
                    // console.log(id.toString() + "_2");
                  }}
                >
                  Page 2
                </button>
              </>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="eventForm">
        <video src={vid} muted autoPlay loop></video>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <h1>{event.name}</h1>
          {loggedIn ? (
            !registered ? (
              ethereal ? (
                solo ? (
                  <button
                    onClick={() => {
                      handleRegister();
                    }}
                    className="loginBtn"
                  >
                    Participate
                  </button>
                ) : (
                  <>
                    <PostTeam />
                    {mes.trim() == "" ? (
                      newTeam && (
                        <p className="newTeamMsg">
                          A new team <span>{oText}</span> will be created with
                          you as Team Lead
                        </p>
                      )
                    ) : (
                      <p>{mes}</p>
                    )}
                    {oldTeam && <ConfirmTeam team={oldTeamVal} />}
                    {oldTeam ? (
                      <button
                        onClick={() => {
                          handleJoin();
                        }}
                        className="loginBtn"
                      >
                        Join Team
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleRegister();
                        }}
                        className="loginBtn"
                      >
                        Participate
                      </button>
                    )}
                  </>
                )
              ) : (
                <>
                  <p className="btText">Buy Ethereal Ticket to participate</p>
                  <button
                    className="customButton"
                    onClick={() => {
                      navigate("/auth");
                    }}
                  >
                    Buy Tickets
                  </button>
                </>
              )
            ) : solo ? (
              <>
                <button disabled={true} className="rulesBtn">
                  Registered
                </button>
                {/* {!etherealNew && (
                  <>
                    <p className="btText">
                      Buy Ethereal Ticket to confirm participation
                    </p>
                    <button
                      className="customButton"
                      onClick={() => {
                        navigate("/auth");
                      }}
                    >
                      Buy Tickets
                    </button>
                  </>
                )} */}
              </>
            ) : (
              <>
                {/* <h1>Hel</h1> */}
                <GetTeam team={team} />
              </>
            )
          ) : (
            <>
              <p className="fontJura">Login to participate</p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/auth");
                }}
                className="loginBtn"
              >
                Login
              </button>
            </>
          )}

          {ethereal && !solo && (
            <>
              <p
                className="fontJura"
                style={{ fontSize: "1.2rem", textAlign: "left" }}
              >
                How to participate?
              </p>
              <p className="fontJura" style={{ fontSize: "1rem" }}>
                1. A team should be created by the team lead. <br />
                2. Other members should login and then join the team. <br />
                3. Team name must be unique. <br />
                4. Participants of a team must be of same college. <br />
                5. Everyone in a team must buy tickets. <br />
                <span className="coordinators">
                  <br />
                  Coordinators: <br /> {cw(event.coordinators[0].name)} -{" "}
                  {event.coordinators[0].phone},{" "}
                  {cw(event.coordinators[1].name)} -{" "}
                  {event.coordinators[1].phone}{" "}
                </span>
              </p>
            </>
          )}
          <button
            onClick={(e) => {
              setRulesShow(!rulesShow);
            }}
            className="rulesBtn"
          >
            Event Rules
          </button>
          {!etherealNew && (
            <>
              <p className="btText">
                Buy Ethereal Ticket to confirm participation
              </p>
              <button
                className="customButton"
                onClick={() => {
                  navigate("/auth");
                }}
              >
                Buy Tickets
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default EventPage;
