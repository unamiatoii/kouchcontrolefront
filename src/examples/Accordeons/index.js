import { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

function AccordionMenu({ menuKey, name, icon, collapseName, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ marginBottom: "0.1rem" }}>
      {/* Élément principal du menu */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: "10px",
          fontWeight: "bolder",
          backgroundColor: "transparent",
          borderRadius: "5px",
          transition: "background-color 0.3s ease",
        }}
        onClick={toggleMenu}
      >
        <SidenavCollapse name={name} icon={icon} active={menuKey === collapseName} />
      </div>

      {/* Sous-menus affichés si l'accordéon est ouvert */}
      {isOpen && children && children.length > 0 && (
        <div style={{ paddingLeft: "20px", paddingTop: "0.02rem" }}>
          {children.map((child) => (
            <NavLink
              key={child.key}
              to={child.route}
              style={{ display: "block", textDecoration: "none", padding: "5px 0" }}
            >
              <SidenavCollapse
                name={child.name}
                icon={child.icon}
                active={child.key === collapseName}
              />
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

// Validation des props
AccordionMenu.propTypes = {
  menuKey: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  collapseName: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
    })
  ),
};

export default AccordionMenu;
