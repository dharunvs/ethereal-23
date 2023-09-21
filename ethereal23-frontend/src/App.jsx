import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Pages from "./Pages";
import Components from "./Components";
import { posterImgArr } from "./Assets/Images/posters";
import { galleryImgArr } from "./Assets/Images/gallery";
import "./App.css";
import loaderVid from "./Assets/Videos/Loader.mp4";

function App() {
  const [loading, setLoading] = useState(true);

  const Loader = () => (
    <div className={loading ? "MainLoader" : "MainLoaderAnim"}>
      <video src={loaderVid} muted autoPlay loop></video>
    </div>
  );

  useEffect(() => {
    let assetsToPreload = [];

    assetsToPreload = assetsToPreload.concat(galleryImgArr);
    assetsToPreload = assetsToPreload.concat(posterImgArr);

    const preloadAsset = (asset) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = asset;
        img.onload = resolve;
        img.onerror = reject;
      });
    };

    const preloadAssetsSequentially = async () => {
      try {
        // await new Promise((resolve, reject) => {
        //   const vid = document.createElement("video");
        //   vid.src = loaderVid;
        //   vid.onload = resolve;
        //   vid.onerror = reject;
        // });
        for (const asset of assetsToPreload) {
          await preloadAsset(asset);
          // console.log(asset, await preloadAsset(asset));
        }

        setTimeout(() => {
          setLoading(false);
        }, 4500);
      } catch (error) {
        console.error("Error preloading assets:", error);
      }
    };

    preloadAssetsSequentially();
  }, []);

  return (
    <div className="App">
      <Router>
        <>
          <Loader />

          <Components.Navbar />
          <Routes>
            <Route
              path="/"
              element={<Pages.Home data={{ galleryImgs: galleryImgArr }} />}
            />
            <Route path="/auth" element={<Pages.Auth />} />
            <Route path="/home" element={<Pages.LoggedIn />} />
            <Route path="/checkout" element={<Pages.Checkout />} />
            {/* <Route path="/checkout" element={<Pages.CheckoutPage />} /> */}
            <Route path="/profile" element={<Pages.Profile />} />
            <Route path="/events" element={<Pages.Events />} />
            <Route path="/event/:id" element={<Pages.EventPage />} />
            <Route path="/schedule" element={<Pages.Schedule />} />
            <Route path="/team" element={<Pages.Team />} />
            <Route path="/contact" element={<Pages.Contact />} />
            <Route
              path="/paymentResult/:success"
              element={<Pages.PaymentResult />}
            />

            {/* <Route path="/gallery" element={<Pages.Gallery />} /> */}
          </Routes>
          <Components.Footer />
        </>
      </Router>
    </div>
  );
}

export default App;
