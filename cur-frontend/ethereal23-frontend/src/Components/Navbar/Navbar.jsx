import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pages } from "../../data";
import "./Navbar.css";

function Navbar() {
  const [active, setActive] = useState(0);
  const [mobNav, setMobNav] = useState(false);

  useEffect(() => {
    pages.forEach((page, index) => {
      if (page.path == window.location.pathname) {
        setActive(index);
      }
    });
  }, [active]);

  const NavLink = ({ name, path, index, classname = "navLink" }) => (
    <Link
      className={active === index ? `${classname}Active` : classname}
      to={path}
      onClick={() => {
        setActive(index);
        setMobNav(false);
      }}
    >
      {name}
    </Link>
  );

  return (
    <nav>
      <div
        className={mobNav ? "burgerAct" : "burger"}
        onClick={() => {
          setMobNav(!mobNav);
        }}
      >
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
      <div className={mobNav ? "contentMob" : "content"}>
        {mobNav && <div className="mbnBG"></div>}
        <ul>
          {pages.map((page, key) => {
            if (page.show)
              return (
                <li key={key}>
                  <NavLink name={page.name} path={page.path} index={key} />
                </li>
              );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
