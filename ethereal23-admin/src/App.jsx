import { useEffect, useState } from "react";
import "./App.css";
import { GET_FEES, BASE_URL } from "./apis";
import axios from "axios";

function App() {
  const [fees, setFees] = useState({});

  useEffect(() => {
    axios
      .get(GET_FEES)
      .then((res) => res.data)
      .then((res) => {
        console.log(res);
        setFees(res);
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

      fetch(BASE_URL + "/upload", {
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
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Update db</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Ethereal Admin</h1>

      <div className="controlBox">
        <h2>Data Control</h2>
        <div className="CBContent"></div>
      </div>

      <div className="controlBox">
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
      </div>

      <div className="controlBox">
        <h2>Payments</h2>
        <div className="CBContent">
          <button>Pause Payments</button>
        </div>
      </div>

      <div className="controlBox">
        <h2>Update db</h2>
        <div className="CBContent">
          <FileUpload />
        </div>
      </div>
      <div className="controlBox">
        <h2>Get db</h2>
        <div className="CBContent">
          {/* <FileUpload /> */}
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
