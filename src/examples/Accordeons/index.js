import { useState } from "react";
import PropTypes from "prop-types";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse"; // Assurez-vous que SidenavCollapse est correctement importé

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
        <div style={{ paddingLeft: "20px", paddingTop: "0.02rem" }}>{children}</div>
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
  children: PropTypes.node, // Acceptation de n'importe quel contenu enfant
};

export default AccordionMenu;
