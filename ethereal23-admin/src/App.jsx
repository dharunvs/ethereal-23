import { useEffect, useState } from "react";
import "./App.css";
import { GET_FEES } from "./apis";
import axios from "axios";

function App() {
  const [fees, setFees] = useState([
    {
      id: 1,
      name: "ETHEREAL",
      price: "-",
    },
    {
      id: 2,
      name: "INNER_COLLEGE_COMBO_CONCERT",
      price: "-",
    },
    {
      id: 3,
      name: "OUTER_COLLEGE_COMBO_CONCERT",
      price: "-",
    },
    {
      id: 4,
      name: "INNER_COLLEGE_CONCERT",
      price: "-",
    },
    {
      id: 5,
      name: "OUTER_COLLEGE_CONCERT",
      price: "-",
    },
  ]);

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
              {fees.map((value, key) => {
                return <FeesElement i={key} key={value.id} />;
              })}
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
    </div>
  );
}

export default App;
