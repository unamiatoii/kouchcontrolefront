import React, { useState } from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";

const MDButtonSpinner = ({ loading, children, ...props }) => {
  return (
    <MDButton {...props} disabled={loading} type="submit" variant="gradient" color="info" fullWidth>
      {loading ? (
        <MDBox display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={27} color="white" />
        </MDBox>
      ) : (
        children
      )}
    </MDButton>
  );
};

MDButtonSpinner.propTypes = {
  loading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default MDButtonSpinner;
