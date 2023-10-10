import { useEffect, useState } from "react";
import "./App.css";
import { GET_FEES, BASE_URL } from "./apis";
import axios from "axios";

function App() {
  const [fees, setFees] = useState({});
  const [events, setEvents] = useState([]);

  const [payPaused, setPayPaused] = useState(false);

  const [qrTestingCode, setQrTestingCode] = useState("");

  const [ydWise, setYdwise] = useState({});

  const [tcount, setTcount] = useState({
    oc_ethereal: 0,
    ic_ethereal: 0,
    oc_concert: 0,
    ic_concert: 0,
    usersLoggedIn: 0,
  });

  useEffect(() => {
    axios
      .get(GET_FEES)
      .then((res) => res.data)
      .then((res) => {
        setFees(res);
      });

    axios
      .get(BASE_URL + "/admin-events")
      .then((res) => res.data)
      .then((res) => {
        setEvents(res.data);
      });

    axios
      .get(BASE_URL + "/admin-config")
      .then((res) => res.data)
      .then((res) => {
        console.log(res.data);
        setPayPaused(res.data.pause_payments);
      });

    axios
      .get(BASE_URL + "/admin-tcount")
      .then((res) => res.data)
      .then((res) => {
        console.log(res);
        setTcount(res.data);
      });
  }, []);

  const [feesEdit, setFeesEdit] = useState(false);

  const FeesElement = ({ i }) => (
    <tr>
      <td>{fees[i]["id"]}</td>
      <td>{fees[i]["name"]}</td>
      <td>
        <input
          type="text"
          value={fees[i]["price"]}
          onChange={(e) => {
            setFees(e.target.value);
          }}
          disabled={!feesEdit}
        />
      </td>
    </tr>
  );

  function FileUpload() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const url = BASE_URL + "/upload-test";

      console.log(selectedFile, url);

      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("File upload response:", data);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    };

    return (
      <div>
        <p>Transaction Excel</p>
        <input
          type="file"
          onChange={handleFileChange}
          placeholder="Transaction XL"
        />
        <button onClick={handleUpload}>Send Tickets</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>
        Ethereal Admin{" "}
        <span className="warning">If unclear, please contact Dharun VS.</span>
      </h1>

      <div className="controlBox">
        <h2>QR Scanner Testing</h2>
        <div className="CBContent">
          <input
            type="text"
            value={qrTestingCode}
            onChange={(e) => {
              setQrTestingCode(e.target.value);
            }}
          />
          <button
            onClick={() => {
              axios
                .post(BASE_URL + "/qr-scanner", { code: qrTestingCode })
                .then((res) => res.data)
                .then((res) => {
                  console.log(res);
                });
            }}
          >
            Test QR
          </button>
        </div>
      </div>

      <div className="controlBox">
        <h2>Tickets Count</h2>
        <div className="CBContent">
          <div className="tcounts">
            <div className="trow">
              <p>OC Ethereal</p>
              <p>{tcount.oc_ethereal}</p>
            </div>
            <div className="trow">
              <p>IC Ethereal</p>
              <p>{tcount.ic_ethereal}</p>
            </div>
            <div className="trow">
              <p>OC Concert</p>
              <p>{tcount.oc_concert}</p>
            </div>
            <div className="trow">
              <p>IC Concert</p>
              <p>{tcount.ic_concert}</p>
            </div>
            <div className="trow">
              <p>Users LoggedIn</p>
              <p>{tcount.usersLoggedIn}</p>
            </div>
          </div>
          <button
            onClick={() => {
              axios
                .get(BASE_URL + "/admin-tcount")
                .then((res) => res.data)
                .then((res) => {
                  console.log(res.data);
                  setTcount(res.data);
                });
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="controlBox">
        <h2>Year wise dept wise</h2>
        <div className="CBContent">
          <button
            onClick={() => {
              axios.get(BASE_URL + "/admin-deptwise-count").then((response) => {
                // Create a link element to trigger the download
                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "Yearwise-Deptwise.csv"); // You can set the desired filename here
                document.body.appendChild(link);
                link.click();
              });
            }}
          >
            Get
          </button>
        </div>
      </div>

      <div className="controlBox">
        <h2>Data Control</h2>
        <div className="CBContent">
          {/* <FileUpload /> */}
          <button
            onClick={() => {
              axios.get(BASE_URL + "/export-csv-users").then((response) => {
                // Create a link element to trigger the download
                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "users.csv"); // You can set the desired filename here
                document.body.appendChild(link);
                link.click();
              });
            }}
          >
            Get Users
          </button>
        </div>
      </div>

      <div className="controlBox">
        <h2>Participants</h2>
        <div className="CBContent">
          {events.map((event, key) => (
            <button
              className="eventName"
              key={key}
              onClick={() => {
                axios
                  .post(BASE_URL + "/admin-events-participants", {
                    eventId: event.event_id,
                    eventName: event.name,
                  })
                  .then((response) => {
                    // Create a link element to trigger the download
                    const url = window.URL.createObjectURL(
                      new Blob([response.data])
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", event.name + ".csv"); // You can set the desired filename here
                    document.body.appendChild(link);
                    link.click();
                  });
              }}
            >
              {event.name}
            </button>
          ))}
        </div>
      </div>

      {/* <div className="controlBox">
        <h2>Fees Control</h2>
        <div className="CBContent">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(fees).map(
                (value, key) => (
                  <p>
                    {value} {key}
                  </p>
                )
                //  <FeesElement i={key} key={value.id} />
              )}
            </tbody>
            <tfoot></tfoot>
          </table>
          <div className="buttons">
            <button
              onClick={() => {
                setFeesEdit(!feesEdit);
              }}
            >
              {feesEdit ? "Cancel" : "Edit"}
            </button>
            <button>Save</button>
          </div>
        </div>
      </div> */}

      <div className="controlBox">
        <h2>Payments</h2>
        <div className="CBContent">
          <p>
            Payments: {payPaused ? "Paused" : "Ongoing"}{" "}
            <span style={{ width: "20px", padding: "20px" }}></span>{" "}
            {payPaused ? (
              <button
                onClick={() => {
                  axios
                    .post(BASE_URL + "/admin-pause-payments", {
                      state: false,
                    })
                    .then(() => {
                      axios
                        .get(BASE_URL + "/admin-config")
                        .then((res) => res.data)
                        .then((res) => {
                          console.log(res.data);
                          setPayPaused(res.data.pause_payments);
                        });
                    });
                }}
              >
                Resume
              </button>
            ) : (
              <button
                onClick={() => {
                  axios
                    .post(BASE_URL + "/admin-pause-payments", {
                      state: true,
                    })
                    .then(() => {
                      axios
                        .get(BASE_URL + "/admin-config")
                        .then((res) => res.data)
                        .then((res) => {
                          console.log(res.data);
                          setPayPaused(res.data.pause_payments);
                        });
                    });
                }}
              >
                Pause
              </button>
            )}
          </p>
        </div>
      </div>

      <div className="controlBox">
        <h2>
          Update Tickets <span className="warning"> DO NOT USE</span>
        </h2>
        <div className="CBContent">
          <FileUpload />
        </div>
      </div>

      <div className="controlBox">
        <h2>
          Get data <span className="warning"> DO NOT USE</span>
        </h2>
        <div className="CBContent">
          {/* <FileUpload /> */}
          <input type="text" placeholder="Query" />
          <button
            onClick={() => {
              axios.get(BASE_URL + "/export-csv");
            }}
          >
            Get DB
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
