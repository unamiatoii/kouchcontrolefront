import React, { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import { Table, TableBody, TableContainer, TableRow, Icon, CircularProgress } from "@mui/material";
import MDBox from "components/MDBox";
import DataTableHeadCell from "./DataTableHeadCell";
import DataTableBodyCell from "./DataTableBodyCell";
import { fetchUsers } from "domain/userSlice";
import EditUserModal from "../component/updateUserModal";
import { fetchRoles } from "domain/roleSlice";

function DataTable({ entriesPerPage, canSearch, isSorted, noEndBorder }) {
  const dispatch = useDispatch();

  // Sélecteurs Redux
  const rawUsers = useSelector((state) => state.users.users);
  const roles = useSelector((state) => state.roles.roles);
  const status = useSelector((state) => state.users.status);

  const [localUsers, setLocalUsers] = useState([]);

  // Charger les utilisateurs au montage
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
      dispatch(fetchRoles());
    }
  }, [dispatch, status]);

  // Formater les utilisateurs avec libellé du rôle
  useEffect(() => {
    if (rawUsers && Array.isArray(rawUsers.data)) {
      const formattedUsers = rawUsers.data.map((user) => {
        const roleLabel = roles.find((role) => role.id === user.role_id)?.name || "Inconnu";
        return {
          lastName: user.name?.split(" ")[1] || "N/A",
          firstName: user.name?.split(" ")[0] || "N/A",
          email: user.email || "N/A",
          role: roleLabel, // Utiliser le libellé
          originalUser: user,
        };
      });
      setLocalUsers(formattedUsers);
    } else {
      setLocalUsers([]);
    }
  }, [rawUsers, roles]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleSave = () => {
    setOpen(false);
  };

  const columns = useMemo(
    () => [
      { Header: "Nom", accessor: "lastName", width: "20%" },
      { Header: "Prénom", accessor: "firstName", width: "20%" },
      { Header: "Email", accessor: "email", width: "30%" },
      { Header: "Rôle", accessor: "role", width: "20%" },
      { Header: "Editer", accessor: "edit", width: "10%" },
    ],
    []
  );

  const data = useMemo(() => {
    return localUsers.map((user) => ({
      ...user,
      edit: (
        <Icon
          sx={{ cursor: "pointer", color: "info.main" }}
          onClick={() => handleEdit(user.originalUser)}
        >
          edit
        </Icon>
      ),
    }));
  }, [localUsers]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = tableInstance;

  return (
    <>
      {status === "loading" ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <CircularProgress />
        </div>
      ) : localUsers.length > 0 ? (
        <TableContainer sx={{ boxShadow: "none" }}>
          <Table {...getTableProps()}>
            <MDBox component="thead">
              {headerGroups.map((headerGroup, key) => (
                <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, idx) => (
                    <DataTableHeadCell
                      key={idx}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      width={column.width || "auto"}
                    >
                      {column.render("Header")}
                    </DataTableHeadCell>
                  ))}
                </TableRow>
              ))}
            </MDBox>
            <TableBody {...getTableBodyProps()}>
              {page.map((row, key) => {
                prepareRow(row);
                return (
                  <TableRow key={key} {...row.getRowProps()}>
                    {row.cells.map((cell, idx) => (
                      <DataTableBodyCell
                        key={idx}
                        align={cell.column.align || "left"}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </DataTableBodyCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p>Aucune donnée disponible ou problème de chargement des utilisateurs.</p>
        </div>
      )}
      <EditUserModal
        open={open}
        onClose={() => setOpen(false)}
        user={selectedUser}
        onSave={handleSave}
      />
    </>
  );
}

DataTable.propTypes = {
  entriesPerPage: PropTypes.number,
  canSearch: PropTypes.bool,
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
};

export default DataTable;