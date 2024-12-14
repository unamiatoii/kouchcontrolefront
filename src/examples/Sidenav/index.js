import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import AccordionMenu from "examples/Accordeons"; // Importation du composant AccordionMenu
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

function Sidenav({ user, routes, onLogout, brand, brandName, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const [activeMenus, setActiveMenus] = useState({});
  const role = user?.role;
  const textColor =
    transparentSidenav || (whiteSidenav && !darkMode)
      ? "dark"
      : whiteSidenav && darkMode
      ? "inherit"
      : "white";

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  const toggleMenu = (key) => {
    setActiveMenus((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1200;
      setMiniSidenav(dispatch, isMobile);
      setTransparentSidenav(dispatch, !isMobile && transparentSidenav);
      setWhiteSidenav(dispatch, !isMobile && whiteSidenav);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, transparentSidenav, whiteSidenav]);

  const filterRoutes = (routes) =>
    routes
      .map((route) => {
        if (route.roles && !route.roles.includes(user?.role)) return null;
        const filteredChildren = route.children?.filter(
          (child) => !child.roles || child.roles.includes(user?.role)
        );
        return { ...route, children: filteredChildren };
      })
      .filter(Boolean);

  const isRouteActive = (routePath) => location.pathname === routePath;

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <Icon sx={{ fontWeight: "bold" }}>close</Icon>
        </MDBox>
        <MDBox component={NavLink} to="/dashboard" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" width="3rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {user?.name}
            </MDTypography>
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {role}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider light={!darkMode || whiteSidenav} />
      {/* Menu principal */}
      <MDBox>
        {filterRoutes(routes).map(({ key, name, icon, children }) => (
          <AccordionMenu
            key={key}
            menuKey={key}
            name={name}
            icon={icon}
            collapseName={key}
            isOpen={activeMenus[key] || isRouteActive(`/${key}`)}
            toggleMenu={() => toggleMenu(key)}
          >
            {children?.map((child) => (
              <NavLink
                key={child.key}
                to={child.route}
                className={isRouteActive(child.route) ? "activeMenuItem" : ""}
                style={{
                  display: "block",
                  textDecoration: "none",
                  padding: "5px 0",
                }}
              >
                <SidenavCollapse
                  key={child.key}
                  name={child.name}
                  icon={child.icon}
                  route={child.route}
                  active={isRouteActive(child.route)}
                />
              </NavLink>
            ))}
          </AccordionMenu>
        ))}

        {/* Déconnexion */}
        <MDBox p={2}>
          <MDButton
            color="error"
            fullWidth
            onClick={onLogout}
            sx={{ borderRadius: "8px", padding: "10px" }}
          >
            Déconnexion
          </MDButton>
        </MDBox>
      </MDBox>
    </SidenavRoot>
  );
}

Sidenav.defaultProps = {
  brand: "",
};

// Validation des PropTypes
Sidenav.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string,
      roles: PropTypes.arrayOf(PropTypes.string),
      children: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          route: PropTypes.string.isRequired,
          icon: PropTypes.string,
          roles: PropTypes.arrayOf(PropTypes.string),
        })
      ),
    })
  ).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Sidenav;
