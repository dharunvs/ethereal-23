import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import "./PaymentResult.css";

function PaymentResult() {
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

  let { success } = useParams();
  console.log(success);

  const Success = () => {
    return <div>Success</div>;
  };
  const Failed = () => {
    return <div>Failed</div>;
  };

  return (
    <div>
      {success === true ? <Success /> : success === false ? <Failed /> : <></>}
    </div>
  );
}

export default PaymentResult;
