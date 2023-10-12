import { useEffect, useState } from "react";
import "./App.css";
import { GET_FEES, BASE_URL } from "./apis";
import axios from "axios";

function App() {
  const colleges = [
    "Aalim Muhammed Salegh College of Engineering, Chennai",
    "Aarupadai Veedu Institute of Technology, Kanchipuram",
    "Agni College of Technology, Chennai",
    "B.S. Abdur Rahman University (B.S. Abdur Rahman Crescent Engineering College), Chennai",
    "Bharath University (Bharath Institute of Higher Education and Research), Chennai",
    "Chennai Institute of Technology, Chennai",
    "Dhanalakshmi College of Engineering, Chennai",
    "Dr. MGR University (Dr. M.G.R. Educational and Research Insitute), Chennai",
    "Easwari Engineering College, Chennai",
    "G.K.M. College of Engineering and Technology, Chennai",
    "Hindustan University (Hindustan College of Engineering), Chennai",
    "Jerusalem College of Engineering, Chennai",
    "K.C.G. College of Technology, Chennai",
    "Meenakshi Sundararajan Engineering College, Chennai",
    "PERI Institute of Technology, Chennai",
    "Raja Rajeswari Engineering College, Chennai",
    "S.A. Engineering College, Thiruverkadu",
    "S.K.R. Engineering College, Thiruvallur",
    "Sree Sastha Institute of Engineering and Technology, Chennai",
    "Sri Lakshmi Ammal Engineering College, Chennai",
    "Sri Sai Ram Institute of Technology, Chennai",
    "Sri Sairam Engineering College, Chennai",
    "St. Peter's University (St. Peters Engineering College), Chennai",
    "T.J. Institute of Technology, Chennai",
    "Tagore Engineering College, Chennai",
    "Thangavelu Engineering College, Chennai",
    "Central Institute of Plastic Engineering and Technology (CIPET), Chennai",
    "University Departments of Anna University Chennai, ACT Campus, Chennai",
    "University Departments of Anna University Chennai, CEG Campus, Chennai",
    "University Departments of Anna University Chennai, MIT Campus, Chennai",
    "Alpha College of Engineering, Chennai",
    "Anand Institute of Higher Technology, Chengalpattu Taluk",
    "Annai Veilankanni's College of Engineering, Chennai",
    "Central Institute of Plastics Engineering and Technology, Chennai",
    "Davinci School of Design and Architecture, Chennai",
    "Dhaanish Ahmed College of Engineering, Chennai",
    "Gojan School of Business and Technology, Chennai",
    "Gopal Ramalingam Memorial Engineering College, Chennai",
    "Jawahar Engineering College, Chennai",
    "Jeppiaar Engineering College, Chennai",
    "Loyola-ICAM College of Engineering and Technology, Chennai",
    "Madha Engineering College, Chennai",
    "Madha Institute of Engineering and Technology, Chennai",
    "Magna College of Engineering, Tiruvallur",
    "Measi Academy of Architecture, Chennai",
    "Meenakshi College of Engineering, Chennai",
    "Misrimal Navajee Munoth Jain Engineering College, Chennai",
    "Mohamed Sathak A.J. College of Engineering, Chengelpet Taluk",
    "Mohammed Sathak A J Academy of Architecture, Chennai",
    "New Prince Shri Bhavani College of Engineering and Technology, Chennai",
    "P.M.R. Engineering College, Chennai",
    "Panimalar Engineering College, Chennai",
    "Panimalar Institute of Technology, Chennai",
    "Prince Dr. K. Vasudevan College of Engineering and Technology, Chennai",
    "Prince Shri Venkateshwara Padmavathy Engineering College, Chengalpet",
    "S.R.R. Engineering College, Chengalpattu",
    "Sathyabama University (Sathyabama Engineering College), Chennai",
    "School of Architecture St.Peter's College of Engineering & Technology, Chennai",
    "Sree Sastha College of Engineering, Chennai",
    "Sri Krishna Engineering College, Sriperumpudur",
    "Sri Krishna Institute of Technology, Chennai",
    "Sri Muthukumaran Institute of Technology, Chennai",
    "Sri Ramanujar Engineering College, Chennai",
    "Sri Sivasubramaniya Nadar College of Engineering, Chennai",
    "Srinivasa Institute of Engineering and Technology, Chennai",
    "St. Joseph's College of Engineering, Kanchipuram",
    "St. Peter's College of Engineering and Technology, Chennai",
    "University Departments of Anna University Chennai, SAP Campus, Chennai",
    "Vel Tech, Chennai",
    "Vel Tech Dr.RR and Dr.SR Technical University (Vel Tech Engineering College), Chennai",
    "Vel Tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering College, Chennai",
    "Vel Tech Multi Tech Dr.Rangarajan Dr.Sakunthala Engineering College, Chennai",
    "Velammal Engineering College, Chennai",
    "Asan Memorial College of Arts and Science, Chennai",
    "Bhaktavatsalam Memorial College for Women, Chennai",
    "Meenakshi College for Women, Chennai",
    "Sriram College of Arts and Science, Chennai",
    "Tagore College of Arts and Science, Chennai",
    "Vels University (Vel's College of Science), Chennai",
    "A.M. Jain College (Men), Chennai",
    "Bharathi's Women's College (Autonomous), Chennai",
    "C. Kandasami Naidu College for Men, Chennai",
    "Chellammal Women's College of the Pachaiyappa's Trust, Chennai",
    "Dhanraj Baid Jain College (Autonomous), Chennai",
    "Dharmamurthi Rao Bahadur Calavala Cunnan Chetty's Hindu (D.R.B.C.C.C.H.) College, Chennai",
    "Dr. Ambedkar Government Arts College, Chennai",
    "Dwaraka Doss Goverdhan Doss Vaishnav College, Chennai",
    "Ethiraj College for Women (Autonomous), Chennai",
    "Govt. Arts College for Men (Autonomous), Chennai",
    "Guru Nanak College, Chennai",
    "Justice Basheer Ahmed Syed College for Women, Chennai",
    "Loyola College (Autonomous), Chennai",
    "Madras Christian College (Autonomous), Chennai",
    "New College (Autonomous), Chennai",
    "Pachaiyappa's College, Chennai",
    "Presidency College (Autonomous), Chennai",
    "Quaid-e-Millet College, Chennai",
    "Quaid-e-Millet Government Arts College for Women (Autonomous), Chennai",
    "Queen Mary's College (Autonomous), Chennai",
    "Ramakrishna Mission Vivekananda College (Men), Chennai",
    "S.D.N. Bhatt Vaishnav College for Women, Chennai",
    "S.I.V.E.T. College, Chennai",
    "St. Louis College for the Deaf, Chennai",
    "Stella Maris College for Women (Autonomous), Chennai",
    "Women's Christian College (Autonomous), Chennai",
    "A.A. Arts and Science College (Women), Chennai, Chennai",
    "Alpha Arts and Science College, Chennai",
    "Anna Adarsh College for Women, Chennai",
    "Annai Veilankanni's College of Arts and Science, Chennai",
    "Annai Violet Arts and Science College, Chennai",
    "C.T.M. College of Arts and Science, Chennai",
    "Chennai National College (Arts and Science), Chennai",
    "Chevaliar T. Thomas Elizabeth College for Women, Chennai",
    "Dr. M.G.R. Janaki College of Arts and Science for Women, Chennai",
    "Guru Shree Shanti Vijai Jain College for Women, Chennai",
    "Hindustan College of Arts and Science, Kelambakkam",
    "Indian Harvard Arts and Science College, Chennai",
    "J.A. Arts and Science College, Chennai",
    "Jayagovind Harigopal Agarwal Agarsen College, Chennai",
    "K.C.S. Kasi Nadar College of Arts and Science, Chennai",
    "Kumara Rani Meena Muthiah College of Arts and Science for Women, Chennai",
    "M.O.P. Vaishnav College for Women (Autonomous), Chennai",
    "Madha Arts and Science College, Chennai",
    "Mahalakshmi College of Arts and Science, Chennai",
    "Mar Gregorios Arts and Science College, Chennai",
    "Mohamed Sathak College of Arts and Science, Chennai",
    "Nazareth College of Arts and Science, Chennai",
    "New Prince Shri Bhavani Arts and Science College, Chennai",
    "Patrician College of Arts and Science, Chennai",
    "Poonga College of Arts and Science, Chennai",
    "Prince Shri Venkateshwara Arts and Science College, Chennai",
    "Prof. Dhanapalan College for Women, Chennai",
    "R.B. Gothi Jain College for Women, Chennai",
    "S.R.M. Arts and Science College, Chengalpattu Taluk",
    "Shri Shankarlal Sundarbai Shasun Jain College for Women, Chennai",
    "Sindhi College of Arts and Science, Chennai",
    "Sir Theagaraya College, Chennai",
    "Soka Ikeda Arts and Science College for Women, Chennai",
    "Sri Kanniga Parameswari Arts and Science College for Women, Chennai",
    "Sri Muthukumarasamy College, Chennai",
    "St. Joseph's College (Arts and Science), Chennai",
    "St. Thomas College of Arts and Science, Chennai",
    "T.M.G. College of Arts and Science, Chennai",
    "T.S. Narayanasamy College of Arts and Science, Chennai",
    "Tamilnadu Arts and Science College, Chennai",
    "Thirumurugan College of Arts and Science, Thiruvallur",
    "Thiruthangal Nadar College, Chennai",
    "Vailakanni Malathy Pannicker College of Arts and Science, Chennai",
    "Valliammal College for Women, Chennai",
    "Vel Sri Ranga Sanku College, Chennai",
    "Women's Christian College (Autonomous), Chennai",
    "Dr. MGR University (Thai Moogambigai Dental College and Hospital), Chennai",
    "S.R.M. Dental College and Hospital, Chennai",
    "Saveetha University (Saveetha Dental College and Hospital), Chennai",
    "Sree Balaji Dental College and Hospital, Chennai",
    "Tamilnadu Govt. Dental College, Chennai",
    "Madha Dental College and Hospital, Chennai",
    "Meenakshi University (Meenakshi Ammal Dental College and Hospital), Chennai",
    "Ragas Dental College and Hospital, Chennai",
    "Sri Ramachandra University (Sri Ramachandra Dental College), Chennai",
    "Tagore Dental College and Hospital, Chennai",
    "A.C.S. Medical College and Hospital, Chennai",
    "Sree Balaji Medical College and Hospital, Chennai",
    "SRM Medical College Hospital and Research Centre, Chennai",
    "Cancer Institute, College of Oncological Sciences, Chennai",
    "Dr. A.L.M. PG Institute of Basic Medical Sciences, Chennai",
    "Kilpauk Medical College, Chennai",
    "Madras Medical College and Research Institute, Chennai",
    "Stanley Medical College, Chennai",
    "Sankara Nethralaya Medical Research Foundation, Chennai",
    "Sri Ramachandra University (Sri Ramachandra Medical College and Research Institute), Chennai",
    "Aalim Muhammed Salegh Polytechnic College, Chennai",
    "Sri Sairam Polytechnic College, Chennai",
    "A.M.K Technology Polytechnic College, Chennai",
    "Central Polytechnic College, Chennai",
    "Dr. Dharmambal Government Polytechnic College for Women, Chennai",
    "Government Polytechnic College, Chennai",
    "Government Technical Training Centre, Chennai",
    "Institute of Chemical Technology, Chennai",
    "Institute of Leather Technology, Chennai",
    "Institute of Printing Technology, Chennai",
    "Institute of Textile Technology, Chennai",
    "M.G.R Government Film and T.V. Institute of Tamilnadu, Chennai",
    "P.T. Lee Chengalvaraya Naicker Polytechnic College, Chennai",
    "Ramakrishna Mission Technical Institute, Chennai",
    "Regional Labour Institute, Taramani",
    "State Institute of Commerce Education, Chennai",
    "Hindustan Institute of Engineering Technology, Chennai",
    "Institute of Road Transport Polytechnic College, Chennai, Tambaram",
    "Meenakshi Krishnan Polytechnic College, Chennai",
    "Panimalar Polytechnic College, Chennai",
    "Siga Polytechnic College, Chennai",
    "Sri Balaji Polytechnic College, Chennai",
    "Sri Nallalaghu Polytechnic College, Chennai",
    "Thai Moogambigai Polytechnic College, Chennai",
    "Thiru Seven Hills Polytechnic College, Chennai",
    "V. Ramakrishna Polytechnic College, Chennai",
  ];

  const [fees, setFees] = useState({});
  const [events, setEvents] = useState([]);

  const [payPaused, setPayPaused] = useState(false);

  const [qrTestingCode, setQrTestingCode] = useState("");

  const [ydWise, setYdwise] = useState({});

  const [iData, setIData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    firstYear: false,
  });
  const [imessage, setImessage] = useState("");
  const [uumessage, setUumessage] = useState("");
  const [uuUser, setUuUser] = useState({
    name: "",
    college: "",
    email: "",
    newEmail: "",
  });

  const [tcount, setTcount] = useState({
    oc_ethereal: 0,
    ic_ethereal: 0,
    oc_concert: 0,
    ic_concert: 0,
    fy_con: 0,
    fy_eth: 0,
    fy_combo: 0,
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

  const [qrNameWhite, setQrNameWhite] = useState("");
  const [qrExEmail, setQrExEmail] = useState("");

  return (
    <div className="App">
      <h1>
        Ethereal Admin{" "}
        <span className="warning">If unclear, please contact Dharun VS.</span>
      </h1>

      <div className="controlBox">
        <h2> QR 1</h2>
        <div className="CBContent">
          <input
            type="text"
            placeholder="Email"
            value={qrExEmail}
            onChange={(e) => {
              setQrExEmail(e.target.value);
            }}
          />
          <button
            onClick={async () => {
              // setDownloadLoading(true);
              const response = await axios.post(
                BASE_URL + "/admin-existing-qr",
                {
                  email: qrExEmail,
                },
                { responseType: "arraybuffer" }
              );
              console.log(response);
              const blob = new Blob([response.data], {
                type: "image/png",
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = qrExEmail + "-concert-ticket" + ".png";
              link.click();
              // setDownloadLoading(false);
              setQrExEmail("");
            }}
          >
            Download
          </button>
        </div>
      </div>

      <div className="controlBox">
        <h2>QR</h2>
        <div className="CBContent">
          <input
            type="text"
            placeholder="Name"
            value={qrNameWhite}
            onChange={(e) => {
              setQrNameWhite(e.target.value);
            }}
          />
          <button
            onClick={async () => {
              // setDownloadLoading(true);
              const response = await axios.post(
                BASE_URL + "/admin-create-white",
                {
                  name: qrNameWhite,
                },
                { responseType: "arraybuffer" }
              );
              const blob = new Blob([response.data], {
                type: "image/png",
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = qrNameWhite + "-concert-ticket" + ".png";
              link.click();
              // setDownloadLoading(false);
              setQrNameWhite("");
            }}
          >
            Download
          </button>
        </div>
      </div>

      <div className="controlBox">
        <h2>Desk List</h2>
        <div className="CBContent">
          <button
            onClick={() => {
              axios.get(BASE_URL + "/admin-desklist-ic").then((response) => {
                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "desklist-ic.csv");
                document.body.appendChild(link);
                link.click();
              });
            }}
          >
            InnerClg
          </button>
          <button
            onClick={() => {
              axios.get(BASE_URL + "/admin-desklist-oc").then((response) => {
                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "desklist-oc.csv");
                document.body.appendChild(link);
                link.click();
              });
            }}
          >
            OuterClg
          </button>
          <button
            onClick={() => {
              axios.get(BASE_URL + "/admin-qr-db").then((response) => {
                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "qr-db.csv");
                document.body.appendChild(link);
                link.click();
              });
            }}
          >
            QRDB
          </button>
        </div>
      </div>
      <div className="controlBox">
        <h2>Create user</h2>
        <div className="CBContent">
          <input
            type="text"
            value={iData.email}
            checked={iData.firstYear}
            onChange={(e) => {
              setIData({
                email: e.target.value,
                name: iData.name,
                phone: iData.phone,
                college: iData.college,
                firstYear: iData.firstYear,
              });
            }}
            placeholder="Email"
          />
          <input
            type="text"
            value={iData.name}
            onChange={(e) => {
              setIData({
                email: iData.email,
                name: e.target.value,
                phone: iData.phone,
                college: iData.college,
                firstYear: iData.firstYear,
              });
            }}
            placeholder="Name"
          />

          <input
            type="text"
            value={iData.phone}
            onChange={(e) => {
              setIData({
                email: iData.email,
                name: iData.name,
                phone: e.target.value,
                college: iData.college,
                firstYear: iData.firstYear,
              });
            }}
            placeholder="Phone"
          />
          {/* <input
            type="text"
            value={iData.college}
            onChange={(e) => {
              setIData({
                email: iData.email,
                name: iData.name,
                phone: iData.phone,
                college: e.target.value,
                firstYear: iData.firstYear,
              });
            }}
            placeholder="College"
          /> */}

          <select
            name="colleges"
            id="colleges"
            onChange={(e) => {
              setIData({
                email: iData.email,
                name: iData.name,
                phone: iData.phone,
                college: e.target.value,
                firstYear: iData.firstYear,
              });
              console.log(e.target.value, iData);
            }}
            // value={iData.college}
          >
            {colleges.map((clg, key) => (
              <option key={key} value={clg}>
                {clg}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="firstYear">
            FirstYear
            <input
              type="checkbox"
              style={{ width: "20px", height: "20px" }}
              onChange={(e) => {
                if (e.target.checked) {
                  setIData({
                    email: iData.email,
                    name: iData.name,
                    phone: iData.phone,
                    college: "KCG College Of Technology",
                    firstYear: e.target.checked,
                  });
                } else {
                  setIData({
                    email: iData.email,
                    name: iData.name,
                    phone: iData.phone,
                    college: iData.college,
                    firstYear: e.target.checked,
                  });
                }
              }}
            />
          </label>

          <div className="gtButtons">
            <button
              onClick={() => {
                if (iData.email.trim() != "") {
                  axios
                    .post(BASE_URL + "/admin-checkuser", { email: iData.email })
                    .then((res) => res.data)
                    .then((res) => {
                      console.log(res);
                      if (res.exists) {
                        setImessage(
                          `User exists, Ethereal = ${res.ethereal}, Concert = ${res.concert}`
                        );
                      } else {
                        setImessage("Does not exist");
                      }
                    });
                } else {
                  setImessage("Enter email");
                }
              }}
            >
              Check
            </button>
            <button
              onClick={() => {
                if (
                  iData.email.trim() !== "" &&
                  iData.name.trim() !== "" &&
                  iData.phone.trim() !== "" &&
                  iData.college.trim() !== ""
                ) {
                  axios
                    .post(BASE_URL + "/admin-createuser", iData)
                    .then((res) => res.data)
                    .then((res) => {
                      setImessage(res.mess);
                    });
                } else {
                  setImessage("Enter all fields");
                }
              }}
            >
              Create
            </button>
            <button
              onClick={() => {
                if (iData.email.trim() != "") {
                  axios
                    .post(BASE_URL + "/admin-updateuser", {
                      email: iData.email,
                      code: 1,
                    })
                    .then((res) => res.data)
                    .then((res) => {
                      setImessage(res.mess);
                    });
                } else {
                  setImessage("Enter email");
                }
              }}
            >
              Ethereal
            </button>
            <button
              onClick={() => {
                if (iData.email.trim() != "") {
                  axios
                    .post(BASE_URL + "/admin-updateuser", {
                      email: iData.email,
                      code: 2,
                    })
                    .then((res) => res.data)
                    .then((res) => {
                      setImessage(res.mess);
                    });
                } else {
                  setImessage("Enter email");
                }
              }}
            >
              Concert
            </button>
            <p style={{ color: "red", fontWeight: "bolder" }}>{imessage}</p>
          </div>
        </div>
      </div>

      <div className="controlBox">
        <h2>Update User</h2>
        <div className="CBContent">
          <div className="getUpdateInput">
            <input
              type="email"
              placeholder="Email"
              value={uuUser.email}
              onChange={(e) => {
                setUuUser({
                  name: uuUser.name,
                  email: e.target.value,
                  college: uuUser.college,
                });
              }}
            />
            <button
              onClick={() => {
                if (uuUser.email.trim() != "") {
                  axios
                    .post(BASE_URL + "/admin-get-uuser", {
                      email: uuUser.email,
                    })
                    .then((res) => res.data)
                    .then((res) => {
                      if (res.user == false) {
                        setUumessage("User does not exist");
                      } else {
                        setUuUser({
                          name: res.user.name,
                          email: res.user.email,
                          college: res.user.college,
                          newEmail: res.user.email,
                        });
                      }
                    });
                } else {
                  setUumessage("Enter email");
                }
              }}
            >
              Get user
            </button>
            <p style={{ color: "red", fontWeight: "bolder" }}>{uumessage}</p>
          </div>
          {uuUser.email != "" && (
            <div className="uuUpdateUser">
              <input
                type="text"
                value={uuUser.name}
                onChange={(e) => {
                  setUuUser({
                    name: e.target.value,
                    email: uuUser.email,
                    college: uuUser.college,
                    newEmail: uuUser.newEmail,
                  });
                }}
              />{" "}
              <br />
              <input
                type="text"
                value={uuUser.newEmail}
                onChange={(e) => {
                  setUuUser({
                    name: uuUser.name,
                    email: uuUser.email,
                    college: uuUser.college,
                    newEmail: e.target.value,
                  });
                }}
              />
              <br />
              <select
                name="colleges"
                id="colleges"
                onChange={(e) => {
                  setUuUser({
                    name: uuUser.name,
                    email: uuUser.email,
                    college: e.target.value,
                    newEmail: uuUser.newEmail,
                  });
                  console.log(e.target.value, iData);
                }}
                // value={iData.college}
              >
                {colleges.map((clg, key) => (
                  <option key={key} value={clg}>
                    {clg}
                  </option>
                ))}
              </select>
              <br />
              <button
                onClick={() => {
                  axios
                    .post(BASE_URL + "/admin-update-uuser", uuUser)
                    .then((res) => res.data)
                    .then((res) => {
                      setUumessage(res.mess);
                    });
                }}
              >
                Update
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="controlBox">
        <h2>QR Scanner Testing</h2>
        <div className="CBContent">
          <input
            type="text"
            value={qrTestingCode}
            onChange={(e) => {
              setQrTestingCode(e.target.value);
            }}
            placeholder="concertCode"
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
              <p>FY Ethereal</p>
              <p>{tcount.fy_eth}</p>
            </div>
            <div className="trow">
              <p>FY Concert</p>
              <p>{tcount.fy_con}</p>
            </div>
            <div className="trow">
              <p>FY Combo</p>
              <p>{tcount.fy_combo}</p>
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
          <button
            onClick={() => {
              axios.get(BASE_URL + "/admin-tcount-users").then((response) => {
                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "tcount-users.csv");
                document.body.appendChild(link);
                link.click();
              });
            }}
          >
            Download
          </button>

          <button
            onClick={() => {
              axios
                .post(BASE_URL + "/admin-tcount-users-specific", {
                  type: "ic_ethereal",
                })
                .then((response) => {
                  const url = window.URL.createObjectURL(
                    new Blob([response.data])
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "ic_ethereal-users.csv");
                  document.body.appendChild(link);
                  link.click();
                });
            }}
          >
            IC Ethereal
          </button>
          <button
            onClick={() => {
              axios
                .post(BASE_URL + "/admin-tcount-users-specific", {
                  type: "oc_ethereal",
                })
                .then((response) => {
                  const url = window.URL.createObjectURL(
                    new Blob([response.data])
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "oc_ethereal-users.csv");
                  document.body.appendChild(link);
                  link.click();
                });
            }}
          >
            OC Ethereal
          </button>
          <button
            onClick={() => {
              axios
                .post(BASE_URL + "/admin-tcount-users-specific", {
                  type: "ic_concert",
                })
                .then((response) => {
                  const url = window.URL.createObjectURL(
                    new Blob([response.data])
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "ic_concert-users.csv");
                  document.body.appendChild(link);
                  link.click();
                });
            }}
          >
            IC Concert
          </button>
          <button
            onClick={() => {
              axios
                .post(BASE_URL + "/admin-tcount-users-specific", {
                  type: "oc_concert",
                })
                .then((response) => {
                  const url = window.URL.createObjectURL(
                    new Blob([response.data])
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "oc_concert-users.csv");
                  document.body.appendChild(link);
                  link.click();
                });
            }}
          >
            OC Concert
          </button>
          <button
            onClick={() => {
              axios
                .post(BASE_URL + "/admin-tcount-users-specific", {
                  type: "fy_eth",
                })
                .then((response) => {
                  const url = window.URL.createObjectURL(
                    new Blob([response.data])
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "fy_eth-users.csv");
                  document.body.appendChild(link);
                  link.click();
                });
            }}
          >
            First Years
          </button>
          <button
            onClick={() => {
              axios
                .post(BASE_URL + "/admin-tcount-users-specific", {
                  type: "fy_con",
                })
                .then((response) => {
                  const url = window.URL.createObjectURL(
                    new Blob([response.data])
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "fy_con-users.csv");
                  document.body.appendChild(link);
                  link.click();
                });
            }}
          >
            First Years
          </button>
          <button
            onClick={() => {
              axios
                .post(BASE_URL + "/admin-tcount-users-specific", {
                  type: "fy_combo",
                })
                .then((response) => {
                  const url = window.URL.createObjectURL(
                    new Blob([response.data])
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "fy_combo-users.csv");
                  document.body.appendChild(link);
                  link.click();
                });
            }}
          >
            First Years
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
    </div>
  );
}

export default App;
