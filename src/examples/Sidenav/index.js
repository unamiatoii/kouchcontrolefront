import { useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import AccordionMenu from "examples/Accordeons/index";

function Sidenav({ user, onLogout, brand, brandName, routes, ...rest }) {
  const role = user?.role;

  // Material UI Controller
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");

  // Dynamic Text Color
  const textColor =
    transparentSidenav || (whiteSidenav && !darkMode)
      ? "dark"
      : whiteSidenav && darkMode
      ? "inherit"
      : "white";

  // Close Sidebar
  const closeSidenav = () => setMiniSidenav(dispatch, true);

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

  const renderRoutes = routes
    .filter((route) => {
      // Vérifier si l'utilisateur a le rôle nécessaire pour accéder à la route
      if (route.roles && !route.roles.includes(role)) {
        return false;
      }

      // Si la route a des sous-routes, vérifier également celles-ci
      if (route.children) {
        route.children = route.children.filter((child) => child.roles?.includes(role));
      }
      return true;
    })
    .map((route) => {
      const { type, name, icon, title, key, href, children } = route;

      switch (type) {
        case "collapse":
          return (
            <AccordionMenu
              key={key}
              name={name}
              icon={icon}
              href={href}
              collapseName={collapseName}
            >
              {children &&
                children.length > 0 &&
                children.map((child) => {
                  if (child.roles?.includes(role)) {
                    return (
                      <SidenavCollapse
                        key={child.key}
                        name={child.name}
                        icon={child.icon}
                        route={child.route}
                      >
                        <MDBox display="flex" alignItems="center" pl={3}>
                          <Icon sx={{ fontSize: "1.125rem", mr: 1 }}>{child.icon}</Icon>
                          <MDTypography variant="button" color={textColor}>
                            {child.name}
                          </MDTypography>
                        </MDBox>
                      </SidenavCollapse>
                    );
                  }
                  return null;
                })}
            </AccordionMenu>
          );
        case "title":
          return (
            <MDTypography
              key={key}
              color={textColor}
              display="block"
              variant="caption"
              fontWeight="bold"
              textTransform="uppercase"
              pl={3}
              mt={2}
              mb={1}
              ml={1}
            >
              {title}
            </MDTypography>
          );
        case "divider":
          return <Divider key={key} light={!darkMode || whiteSidenav} />;
        default:
          return null;
      }
    });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      {/* User Welcome */}
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDTypography variant="h6">Bienvenue, {user?.name}</MDTypography>
      </MDBox>
      <Divider />

      {/* Sidebar Header */}
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
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider light={!darkMode || whiteSidenav} />

      {/* Sidebar Content */}
      <List>{renderRoutes}</List>
      <Divider />

      {/* Logout Button */}
      <MDBox p={2}>
        <MDButton variant="contained" color="error" fullWidth onClick={onLogout}>
          Déconnexion
        </MDButton>
      </MDBox>
    </SidenavRoot>
  );
}

Sidenav.defaultProps = {
  brand: "",
};

Sidenav.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
