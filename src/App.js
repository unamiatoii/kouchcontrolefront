import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Custom Components
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Themes
import theme from "assets/theme";
import themeDark from "assets/theme-dark";

// Authentication
import SignIn from "layouts/authentication/sign-in";

// Routes
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Assets
import brandWhite from "assets/images/logos/logo.jpeg";
import brandDark from "assets/images/logos/logo.jpeg";

// Notifications
import { ToastContainer } from "react-toastify";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State and Context
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Check for user authentication from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Handlers
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => {
    setOpenConfigurator(dispatch, !openConfigurator);
  };

  // Generate Routes with Role-Based Access
  const getRoutes = (allRoutes) =>
    allRoutes.flatMap((route) => {
      if (route.collapse) return getRoutes(route.collapse);

      if (route.route) {
        if (!route.roles || route.roles.includes(user?.role?.name)) {
          return <Route exact path={route.route} element={route.component} key={route.key} />;
        }
      }
      return [];
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {isAuthenticated && user ? (
        <>
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="KOUCHCONTROL"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              role={user.role?.name}
              user={user}
              onLogout={() => {
                localStorage.clear();
                setUser(null);
              }}
            />
            <Configurator />
            {configsButton}
          </>
          <Routes>{getRoutes(routes)}</Routes>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<SignIn setUser={setUser} />} />
        </Routes>
      )}
      <ToastContainer />
    </ThemeProvider>
  );
}
