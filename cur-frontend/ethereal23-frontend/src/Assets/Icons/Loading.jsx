import React from "react";
import loader from "./Loading.svg";

function Loading({ className2 = "loaderSVG" }) {
  return <img src={loader} alt="loader" className={className2} />;
}

export default Loading;
