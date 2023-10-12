const qr = require("qrcode");
const puppeteer = require("puppeteer");
const fs = require("fs");

let html = fs.readFileSync("./qrPdf/index.html", "utf8");
// const html = `
// <div id="root">
//       <style>
//         @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap");
//         * {
//           padding: 0;
//           margin: 0;
//           box-sizing: border-box;
//           font-family: "Orbitron", sans-serif;
//           color: white;
//         }
//         #root {
//           width: 500px;
//           height: 500px;
//           /* background-color: gray; */
//           overflow: hidden;
//         }
//         .bgImg {
//           width: 500px;
//           height: 500px;
//           overflow: hidden;
//           position: relative;
//           z-index: -1;
//           position: absolute;
//         }
//         .bgImg img {
//           width: 105%;
//           filter: blur(10px);
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%);
//         }

//         .qrImg {
//           width: 250px;
//           height: 250px;
//           overflow: hidden;
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%);
//           box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
//         }
//         .qrImg img {
//           width: 100%;
//           height: 100%;
//           scale: 1.15;
//         }
//         .content {
//           width: 500px;
//           height: 500px;
//           padding: 20px;
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//           position: relative;
//         }
//         .concert {
//           position: absolute;
//           bottom: 20px;
//           right: 20px;
//         }
//         h1 {
//           font-weight: 900;
//         }
//       </style>
//       <div class="bgImg">
//         <img
//           src="https://firebasestorage.googleapis.com/v0/b/ethereal-test-2023.appspot.com/o/Pradeep.png?alt=media&token=593a76ef-3881-46fe-92c8-9911ff4c8067"
//           alt="bgImg"
//         />
//       </div>
//       <div class="content">
//         <div class="text">
//           <h1>DHARUN VS</h1>
//           <p>KCG of Technology</p>
//         </div>

//         <div class="qrImg">
//           <img
//             src="https://firebasestorage.googleapis.com/v0/b/ethereal-test-2023.appspot.com/o/testQr.png?alt=media&token=446b7ea0-d205-4b90-b396-ea57c7d6cf2a"
//             alt="qrImg"
//           />
//         </div>

//         <p class="concert">Concert Access</p>
//       </div>
//     </div>
// `;

// Function to generate QR code
const generateQRCode = async (text, outputPath) => {
  try {
    const qrData = await qr.toDataURL(text);
    // const html = `<div><img src="${qrData}"><img src="https://firebasestorage.googleapis.com/v0/b/ethereal-test-2023.appspot.com/o/notifyImg.jpeg?alt=media&token=ec638fa2-e19d-4468-8b6e-76edf874c672" ></div>`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);
    await page.evaluate(() => {
      const element = document.getElementById("root");
      //   element.style.backgroundColor = "lightblue";
    });
    await page.pdf({
      path: outputPath,
      width: "500px",
      height: "500px",
      printBackground: true,
    });

    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
};

// Usage
generateQRCode("https://example.com", "qrPdf.pdf");
