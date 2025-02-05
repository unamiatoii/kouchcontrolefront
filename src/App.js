import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logos/logo.jpeg";
import brandDark from "assets/images/logos/logo.jpeg";
import SignIn from "layouts/authentication/sign-in";
import Dashboard from "layouts/dashboard";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { logoutUser } from "./domain/authSlice";
import { fetchChantier } from "./domain/chantierSlice";
import ChantierStock from "pages/chantiers/ChantierStock";
import EntrepotStock from "pages/entrepots/EntrepotStock";
import getRoutes from "./routes"; // Ensure this function returns valid route data

export default function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { chantierName } = useSelector((state) => state.chantier);

  const [controller, materialDispatch] = useMaterialUIController();
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
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    dispatch(fetchChantier());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.clear();
  };

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(materialDispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(materialDispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(materialDispatch, !openConfigurator);

  const getRoutesComponents = (allRoutes) =>
    allRoutes.flatMap((route) => {
      if (route.children) {
        return route.children.map((childRoute) => (
          <Route
            exact
            path={childRoute.route}
            element={childRoute.component}
            key={childRoute.key}
          />
        ));
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
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

  const routes = getRoutes();

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <ToastContainer />

      {isAuthenticated ? (
        <>
          {layout === "dashboard" && (
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="KOUCHCONTROL"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              user={user}
              chantierName={chantierName}
              onLogout={handleLogout}
            />
          )}
          {configsButton}
          <Routes>
            {getRoutesComponents(routes)}
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route
              path="/chantier-stock/:chantierName"
              element={<ChantierStock chantierName={chantierName} />}
            />
            <Route path="/stock/entrepot/:entrepotName" element={<EntrepotStock />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </ThemeProvider>
  );
}
