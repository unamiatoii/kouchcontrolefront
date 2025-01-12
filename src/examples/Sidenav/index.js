import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import AccordionMenu from "examples/Accordeons";
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
  const role = user?.role || "";

  const textColor = transparentSidenav || (whiteSidenav && !darkMode) ? "dark" : "white";

  // Gérer la fermeture du sidenav
  const closeSidenav = () => setMiniSidenav(dispatch, true);

  // Basculer l'état des menus actifs
  const toggleMenu = (key) => {
    setActiveMenus((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  // Gestion de la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1200;
      setMiniSidenav(dispatch, isMobile);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // Filtrer les routes selon le rôle de l'utilisateur
  const filteredRoutes = routes
    .map((route) => {
      if (route.roles && !route.roles.includes(role)) return null;
      const filteredChildren = route.children?.filter(
        (child) => !child.roles || child.roles.includes(role)
      );
      return { ...route, children: filteredChildren };
    })
    .filter(Boolean);

  // Vérifier si une route est active
  const isRouteActive = (routePath) => location.pathname === routePath;

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      {/* En-tête */}
      <MDBox pt={1} pb={1} px={4} textAlign="center">
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
          {brand && <MDBox component="img" src={brand} alt="logo" width="100%" />}
        </MDBox>
        {brandName && (
          <MDBox
            width="100%"
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
            alignItems="center"
          >
            <MDTypography variant="h6" color={textColor}>
              {user?.name}
            </MDTypography>
            <MDTypography variant="button" fontWeight="medium" color={textColor}>
              {role}
            </MDTypography>
          </MDBox>
        )}
      </MDBox>

      <Divider light={!darkMode || whiteSidenav} />

      {/* Menu */}
      <MDBox>
        {filteredRoutes.map(({ key, name, route, icon, children }) => (
          <AccordionMenu
            key={key}
            menuKey={key}
            name={name}
            icon={icon}
            collapseName={key}
            route={route || ""}
            active={isRouteActive(route)}
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
                  name={child.name}
                  icon={child.icon}
                  route={child.route || ""}
                  active={isRouteActive(child.route)}
                />
              </NavLink>
            ))}
          </AccordionMenu>
        ))}
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
  brandName: "",
};

Sidenav.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  brand: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      roles: PropTypes.arrayOf(PropTypes.string),
      children: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          route: PropTypes.string,
          icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
          roles: PropTypes.arrayOf(PropTypes.string),
        })
      ),
    })
  ).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Sidenav;
