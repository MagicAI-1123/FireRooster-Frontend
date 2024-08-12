"use client";
import { useAppSelector } from "@/hooks/store.hooks";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import { AlertObject } from "@/services/types/alert.type";
import { House, LocalFireDepartment, Radio } from "@mui/icons-material";
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  TablePagination,
  Typography,
  styled,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/store/StoreProvider";
import { Category } from "@/services/types/settings.type";
import { unknown } from "zod";

interface AlertPageProps {
  data: Category[];
  fetchAlertData: (category: string) => void;
  scanner_id: Number;
}

export function SettingsPage({
  data,
  fetchAlertData,
  scanner_id,
}: AlertPageProps) {
  const [filterAlert, setFilterAlert] = useState("ALL");
  const router = useRouter();

  const { isAuth } = useCheckAuth();
  const { currentStateName, setCurrentStateName } = useStore();
  const { currentScanners, setCurrentScanners } = useStore();

  const StyledTableRow = styled(TableRow)(() => ({
    td: { backgroundColor: "white" },
    th: { backgroundColor: "white" },
  }));

  const StyledTableHeaderRow = styled(TableRow)(() => ({
    th: {
      fontSize: ".8rem",
      fontWeight: "bold",
    },
  }));

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterAlert(event.target.value as string);
    fetchAlertData(event.target.value as string);
  };

  useEffect(() => {
    if (!isAuth) router.push("/auth/login");
  }, [isAuth]);

  return (
    <>
      <div className="flex justify-between mb-4 items-center p-4 bg-white rounded">
        <div className="font-semibold text-xl text-coolGray-800">Settings</div>
        <div className="w-52">
          <FormControl size="small" fullWidth>
            <InputLabel id="alert-filter-label">Settings</InputLabel>
            <Select
              labelId="alert-filter-label"
              id="alert-filter"
              label="Settings"
              value={filterAlert}
              onChange={handleFilterChange}
            >
              <MenuItem value={"ALL"} selected>
                ALL
              </MenuItem>
              <MenuItem value={"Fire Alerts"}>
                Fire Alerts
                <LocalFireDepartment color="warning" className="ms-1" />
              </MenuItem>
              <MenuItem value={"Police Dispatch"}>Police Dispatch</MenuItem>
              <MenuItem value={"Medical Emergencies"}>
                Medical Emergencies
              </MenuItem>
              <MenuItem value={"Miscellaneous (MISC)"}>
                Miscellaneous (MISC)
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <Divider />
      <Paper sx={{ width: "100%" }} className="mt-3">
        <div className="font-bold text-sm text-coolGray-100 ms-3">
          US &gt; {currentStateName} &gt;{" "}
          {currentScanners === "allscanners" ? "All scanners" : "My scanners"}
        </div>
      </Paper>

      <Paper sx={{ width: "100%" }} className="mt-6">
        <TableContainer sx={{ maxHeight: "68vh" }}>
          <Table
            sx={{
              overflowX: "scroll",
              marginBottom: "20px",
            }}
            aria-label="simple table"
          >
            <TableHead>
              <StyledTableHeaderRow>
                <TableCell
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  <div className="font-bold">Alert</div>
                </TableCell>
                <TableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  NO
                </TableCell>
                <TableCell
                  align="center"
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  <div className="font-bold">Keyword</div>
                </TableCell>
                <TableCell
                  align="center"
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  <div className="font-bold">Type</div>
                </TableCell>
                <TableCell
                  align="center"
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  <div className="font-bold">Traffic (24hrs)</div>
                </TableCell>
                <TableCell
                  align="center"
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  <div className="font-bold">Traffic (%)</div>
                </TableCell>
                <TableCell
                  align="center"
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  <div className="font-bold">Lifetime</div>
                </TableCell>
              </StyledTableHeaderRow>
            </TableHead>
            <TableBody
              sx={{ maxHeight: "calc(50vh - 56px)", overflowY: "auto" }}
            >
              {data?.map((row, i) => (
                <StyledTableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/dashboard/scanners/${scanner_id}/alert/${row.sub_category}`
                    )
                  }
                >
                  <TableCell>
                    <LocalFireDepartment color="warning" />
                  </TableCell>
                  <TableCell scope="row">{row.id}</TableCell>
                  <TableCell align="center">{row.sub_category}</TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
