  import React from "react";
  import { serviceDropdown } from "./Navitems";
  import "../styles/dropdown.css";
  import { Link } from "react-router-dom";

  const Dropdown = ({ toggleMenu }) => {
    return (
      <ul className="services-submenu clicked">
        {serviceDropdown.map((item) => (
          <li key={item.id}>
            <Link to={item.path} className={item.cName} onClick={toggleMenu}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  export default Dropdown;
