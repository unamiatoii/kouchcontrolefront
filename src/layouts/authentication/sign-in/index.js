import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "domain/authSlice";

// Material UI components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { toast } from "react-toastify";
import MDButtonSpinner from "components/MDButtonSpinner.js";

function Basic() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await dispatch(loginUser({ email, password }));

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Connexion réussie! Bienvenue.");
        navigate("/dashboard");
      } else {
        const errorMsg =
          result.payload?.message || "Connexion échouée. Veuillez vérifier vos identifiants.";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Login failed", error);
      const errorMsg = error.message || "Erreur de connexion. Veuillez réessayer.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Authentification
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {errorMessage && (
            <MDBox mt={2} mb={3} textAlign="center">
              <MDTypography variant="caption" color="error">
                {errorMessage}
              </MDTypography>
            </MDBox>
          )}
          <MDBox component="form" onSubmit={handleLogin} role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errorMessage}
                helperText={errorMessage && "Veuillez entrer un email valide."}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errorMessage}
                helperText={errorMessage && "Veuillez entrer un mot de passe valide."}
                required
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Se souvenir de moi
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButtonSpinner loading={loading}>SE CONNECTER</MDButtonSpinner>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
