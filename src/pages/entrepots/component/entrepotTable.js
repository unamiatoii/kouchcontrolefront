import React, { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import { Table, TableBody, TableContainer, TableRow, Icon, CircularProgress } from "@mui/material";
import MDBox from "components/MDBox";
import DataTableHeadCell from "./DataTableHeadCell";
import DataTableBodyCell from "./DataTableBodyCell";
import { fetchEntrepots } from "domain/entrepotSlice";
import EditEntrepotModal from "../component/updateEntrepotModal";

function DataTable({ entriesPerPage, canSearch, isSorted, noEndBorder }) {
  const dispatch = useDispatch();

  // Sélecteurs Redux
  const { entrepots = [], status = "idle" } = useSelector((state) => state.entrepots || {});

  const [localEntrepots, setLocalEntrepots] = useState([]);

  // Charger les entrepôts au montage
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEntrepots());
    }
  }, [dispatch, status]);

  // Formater les entrepôts
  useEffect(() => {
    const formattedEntrepots = entrepots.map((entrepot) => ({
      name: entrepot.name || "N/A",
      location: entrepot.location || "N/A",
      capacity: entrepot.capacity || "N/A",
      originalEntrepot: entrepot,
    }));
    setLocalEntrepots(formattedEntrepots);
  }, [entrepots]);

  const [selectedEntrepot, setSelectedEntrepot] = useState(null);
  const [open, setOpen] = useState(false);

  const handleEdit = (entrepot) => {
    setSelectedEntrepot(entrepot);
    setOpen(true);
  };

  const handleSave = () => {
    setOpen(false);
  };

  const columns = useMemo(
    () => [
      { Header: "Nom", accessor: "name", width: "30%" },
      { Header: "Localisation", accessor: "location", width: "40%" },
      { Header: "Capacité", accessor: "capacity", width: "20%" },
      { Header: "Editer", accessor: "edit", width: "10%" },
    ],
    []
  );

  const data = useMemo(
    () =>
      localEntrepots.map((entrepot) => ({
        ...entrepot,
        edit: (
          <Icon
            sx={{ cursor: "pointer", color: "info.main" }}
            onClick={() => handleEdit(entrepot.originalEntrepot)}
          >
            edit
          </Icon>
        ),
      })),
    [localEntrepots]
  );

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
      ) : localEntrepots.length > 0 ? (
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
          <p>Aucune donnée disponible ou problème de chargement des entrepôts.</p>
        </div>
      )}
      <EditEntrepotModal
        open={open}
        onClose={() => setOpen(false)}
        entrepot={selectedEntrepot}
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
