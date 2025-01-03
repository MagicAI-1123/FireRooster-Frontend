import { useCheckAuth } from "@/hooks/useCheckAuth";
import { AlertObject } from "@/services/types/alert.type";
import {
  House,
  LocalFireDepartment,
  LocalPolice,
  MedicalInformation,
  MiscellaneousServices,
  Radio,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  TablePagination,
  TextField,
  Typography,
  styled,
  Select,
  SelectChangeEvent,
  useMediaQuery,
  Rating,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod";
import Json2CSV from "./Json2CSV";

interface AlertPageProps {
  data: AlertObject[];
  page: number;
  headSearch: string;
  decSearch: string;
  alertIdSearch: number;
  handleHeadSearchChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleDecSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAlertIdSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterAlert: string;
  handleInfoChange?: (event: SelectChangeEvent) => void;
  handleClickStars: (value: number) => void;
  currentStars: number;
  scanner_id?: number;
  rowsPerPage: number;
  totalPages: number;
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleChangePage: (event: unknown, newPage: number) => void;
  selectedFrom: Date | null;
  selectedTo: Date | null;
  handleDateChange: (
    event: unknown,
    type: "from" | "to",
    date: Date
  ) => void;
  countySearch: string;
  handleCountyChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function AlertPage({
  data,
  page,
  headSearch,
  decSearch,
  alertIdSearch,
  handleHeadSearchChange,
  handleDecSearchChange,
  handleAlertIdSearchChange,
  filterAlert,
  handleInfoChange,
  handleClickStars,
  currentStars,
  scanner_id,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  totalPages,
  selectedFrom,
  selectedTo,
  handleDateChange,
  handleCountyChange,
  countySearch,
}: AlertPageProps) {
  const router = useRouter();
  const { isAuth } = useCheckAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!isAuth) router.push("/auth/login");
  }, [isAuth, router]);

  const StyledTableRow = styled(TableRow)(({ color }) => ({
    td: { backgroundColor: color },
    th: { backgroundColor: color },
  }));

  const handleRowClick = (rowData: any) => {
    let subcategory = rowData.alert.sub_category;
    subcategory = subcategory.replace("/", "-");
    router.push(
      `/dashboard/scanners/${rowData.alert.scanner_id}/alert/${subcategory}/${rowData.alert.id}`
    );
  };

  const renderAlertIcon = (category: string) => {
    switch (category) {
      case "Fire Alerts":
        return <LocalFireDepartment color="warning" />;
      case "Police Dispatch":
        return <LocalPolice color="warning" />;
      case "Medical Emergencies":
        return <MedicalInformation color="warning" />;
      case "Miscellaneous (MISC)":
        return <MiscellaneousServices color="warning" />;
      default:
        return null;
    }
  };

  const starCount = 5;
  const stars = Array(starCount).fill(0); 

  const StyledTableHeaderRow = styled(TableRow)(() => ({
    th: {
      fontSize: ".8rem",
      fontWeight: "bold",
      position: "relative",
      zIndex: "0"
    },
  }));


  return (
    <>
      <div className="mb-4 p-4 bg-white rounded">
        <div className="font-semibold text-xl text-coolGray-800 text-center">Alerts</div>
        {isMobile ? (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Filters</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {/* Headline Search */}
                <Grid item xs={12}>
                  <FormControl size="small" fullWidth>
                    <TextField
                      size="small"
                      onChange={handleHeadSearchChange}
                      value={headSearch}
                      name="headSearch"
                      label="Search Headline"
                    />
                  </FormControl>
                </Grid>
                {/* Description Search */}
                <Grid item xs={12}>
                  <FormControl size="small" fullWidth>
                    <TextField
                      size="small"
                      onChange={handleDecSearchChange}
                      value={decSearch}
                      name="decSearch"
                      label="Search Description"
                    />
                  </FormControl>
                </Grid>
                {/* Alert Filter */}
                {scanner_id === undefined && (
                  <Grid item xs={12}>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="alert-filter-label">
                        Select alert
                      </InputLabel>
                      <Select
                        labelId="alert-filter-label"
                        id="alert-filter"
                        label="Select alert"
                        value={filterAlert}
                        onChange={handleInfoChange}
                        name="alert"
                      >
                        <MenuItem value={"ALL"}>
                          <span className="mx-auto">ALL</span>
                        </MenuItem>
                        <MenuItem value={"Fire Alerts"}>
                          <LocalFireDepartment
                            color="warning"
                            className="mr-2"
                          />
                          Fire Alerts
                        </MenuItem>
                        <MenuItem value={"Police Dispatch"}>
                          <LocalPolice color="warning" className="mr-2" />
                          Police Dispatch
                        </MenuItem>
                        <MenuItem value={"Medical Emergencies"}>
                          <MedicalInformation
                            color="warning"
                            className="mr-2"
                          />
                          Medical Emergencies
                        </MenuItem>
                        <MenuItem value={"Miscellaneous (MISC)"}>
                          <MiscellaneousServices
                            color="warning"
                            className="mr-2"
                          />
                          Miscellaneous (MISC)
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs={12}>  
                  <FormControl size="small" fullWidth>  
                    <TextField  
                      size="small"  
                      onChange={handleAlertIdSearchChange}  
                      value={alertIdSearch.toString()} // Convert number to string for display   
                      name="alertIdSearch"  
                      label="Search Alert ID"
                      InputProps={{  
                        inputProps: { pattern: "[0-9]*", inputMode: "numeric"  } // This pattern limits the input to numbers  
                      }}  
                    />  
                  </FormControl>  
                </Grid>  
                {/* Date Pickers */}
                <Grid item xs={12}>
                  <DatePicker
                    selected={selectedFrom}
                    onChange={(date, e) =>
                      handleDateChange(e, "from", date as Date)
                    }
                    placeholderText="From"
                    isClearable
                    customInput={
                      <TextField
                        size="small"
                        label="From"
                        variant="outlined"
                        fullWidth
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    selected={selectedTo}
                    onChange={(date, e) =>
                      handleDateChange(e, "to", date as Date)
                    }
                    placeholderText="To"
                    isClearable
                    customInput={
                      <TextField
                        size="small"
                        label="To"
                        variant="outlined"
                        fullWidth
                      />
                    }
                  />
                </Grid>
                {/* Rating Filter */}
                <Grid item xs={12}>
                  <Rating
                    name="alert-rating"
                    value={currentStars}
                    onChange={(event, newValue) => {
                      handleClickStars(newValue || 0);
                    }}
                    max={starCount}
                  />
                </Grid>
                <Json2CSV 
                  isMobile={isMobile}
                  data={data}
                />
              </Grid>
            </AccordionDetails>
          </Accordion>
        ) : (
          <Grid container spacing={2} mt={1}>
            {/* Desktop Filters */}
            {/* First Row - 5 items */}
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <FormControl size="small" fullWidth>
                <TextField
                  size="small"
                  onChange={handleHeadSearchChange}
                  value={headSearch}
                  name="headSearch"
                  label="Search Headline"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <FormControl size="small" fullWidth>
                <TextField
                  size="small"
                  onChange={handleDecSearchChange}
                  value={decSearch}
                  name="decSearch"
                  label="Search Description"
                />
              </FormControl>
            </Grid>
            {scanner_id === undefined && (
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="alert-filter-label">Select alert</InputLabel>
                  <Select
                    labelId="alert-filter-label"
                    id="alert-filter"
                    label="Select alert"
                    value={filterAlert}
                    onChange={handleInfoChange}
                    name="alert"
                  >
                    <MenuItem value={"ALL"}>
                      <span className="mx-auto">ALL</span>
                    </MenuItem>
                    <MenuItem value={"Fire Alerts"}>
                      <LocalFireDepartment
                        color="warning"
                        className="mr-2"
                      />
                      Fire Alerts
                    </MenuItem>
                    <MenuItem value={"Police Dispatch"}>
                      <LocalPolice color="warning" className="mr-2" />
                      Police Dispatch
                    </MenuItem>
                    <MenuItem value={"Medical Emergencies"}>
                      <MedicalInformation
                        color="warning"
                        className="mr-2"
                      />
                      Medical Emergencies
                    </MenuItem>
                    <MenuItem value={"Miscellaneous (MISC)"}>
                      <MiscellaneousServices
                        color="warning"
                        className="mr-2"
                      />
                      Miscellaneous (MISC)
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <FormControl size="small" fullWidth>
                <TextField
                  size="small"
                  onChange={handleAlertIdSearchChange}
                  value={alertIdSearch.toString()}
                  name="alertIdSearch"
                  label="Search Alert ID"
                  InputProps={{
                    inputProps: { pattern: "[0-9]*", inputMode: "numeric" }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <Rating
                name="alert-rating"
                value={currentStars}
                onChange={(event, newValue) => {
                  handleClickStars(newValue || 0);
                }}
                max={starCount}
                sx={{marginTop: "8px"}}
              />
            </Grid>

            {/* Second Row - 5 items */}
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <DatePicker
                selected={selectedFrom}
                onChange={(date, e) => handleDateChange(e, "from", date as Date)}
                placeholderText="From"
                isClearable
                customInput={
                  <TextField
                    size="small"
                    label="From"
                    variant="outlined"
                    fullWidth
                  />
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <DatePicker
                selected={selectedTo}
                onChange={(date, e) => handleDateChange(e, "to", date as Date)}
                placeholderText="To"
                isClearable
                customInput={
                  <TextField
                    size="small"
                    label="To"
                    variant="outlined"
                    fullWidth
                  />
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <FormControl size="small" fullWidth>
                <TextField
                  size="small"
                  onChange={handleCountyChange}
                  value={countySearch}
                  name="countySearch"
                  label="Search County"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <Json2CSV 
                isMobile={isMobile}
                data={data}
              />
            </Grid>
          </Grid>
        )}
      </div>
      <Divider />
      {isMobile ? (
        <div>
          {data?.map((row) => (
            <Card
              key={row.alert.id}
              onClick={() => handleRowClick(row)}
              sx={{ mb: 2 }}
            >
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    {renderAlertIcon(row.alert.category)}
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="subtitle1">
                      {new Date(row.alert?.dateTime).toLocaleString()}
                    </Typography>
                    <Typography variant="h6">
                      {row.alert.headline}
                    </Typography>
                    <Typography variant="body2">
                      {row.alert.description}
                    </Typography>
                    <Rating
                      name="read-only"
                      value={row.alert?.rating}
                      readOnly
                      max={starCount}
                    />
                    <Typography variant="body2">
                      Address: {
                        <div className="font-bold">
                          {
                            row.alert.address.length > 200
                            ? row.alert.address.slice(0, 200) + "..."
                            : row.alert.address
                          }
                        </div>
                      }
                    </Typography>
                    <Box mt={1}>
                      <House />
                      <Radio />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
            component="div"
            count={totalPages}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      ) : (
        <Paper sx={{ width: "100%" }} className="mt-6">
          <TableContainer sx={{ maxHeight: "65vh" }}>
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
                    Id
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
                    <div className="font-bold">Headline</div>
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
                    <div className="font-bold">Description</div>
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
                    <div className="font-bold ml-2">Rating</div>
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
                    <div className="font-bold">Address</div>
                  </TableCell>
                  {/* <TableCell
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
                  </TableCell> */}
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
                    <div className="font-bold">Source</div>
                  </TableCell>
                </StyledTableHeaderRow>
              </TableHead>
              <TableBody
                sx={{ maxHeight: "calc(50vh - 112px)", overflowY: "auto" }}
              >
                {data?.map((row, i) => (
                  <StyledTableRow
                    key={row.alert.id}
                    className="cursor-pointer"
                    color={
                      row.alert.is_visited === null || row.alert.is_visited === 0
                        ? "#dee2fd88"
                        : "white"
                    }
                  >
                    <TableCell onClick={() => handleRowClick(row)}>
                      {row.alert.category == "Fire Alerts" && (
                        <LocalFireDepartment color="warning" />
                      )}
                      {row.alert.category == "Police Dispatch" && (
                        <LocalPolice color="warning" />
                      )}
                      {row.alert.category == "Medical Emergencies" && (
                        <MedicalInformation color="warning" />
                      )}
                      {row.alert.category == "Miscellaneous (MISC)" && (
                        <MiscellaneousServices color="warning" />
                      )}
                    </TableCell>
                    <TableCell scope="row" onClick={() => handleRowClick(row)}>
                      {new Date(row.alert?.dateTime).toLocaleString()}
                    </TableCell>
                    <TableCell align="center" onClick={() => handleRowClick(row)}>
                      {row.alert.headline.length > 25
                        ? row.alert.headline.slice(0, 25) + "..."
                        : row.alert.headline}
                    </TableCell>
                    <TableCell align="center" onClick={() => handleRowClick(row)}>
                      <div className="font-bold">
                        {row.alert.description.length > 130
                          ? row.alert.description.slice(0, 130) + "..."
                          : row.alert.description}
                      </div>
                    </TableCell>
                    <TableCell align="center" >
                      <Grid item xs={10}>
                        <Rating
                          name="alert-rating"
                          value={row.alert.rating}
                          max={starCount}
                        />
                      </Grid>
                    </TableCell>
                    <TableCell align="center" onClick={() => handleRowClick(row)}>
                      <div className="font-bold">
                        {row.alert.address.length > 200
                          ? row.alert.address.slice(0, 200) + "..."
                          : row.alert.address}
                      </div>
                    </TableCell>
                    {/* <TableCell align="center" onClick={() => handleRowClick(row)}>
                      <House />
                    </TableCell> */}
                    <TableCell
                      align="center"
                      onClick={() => router.push('/dashboard/scanners')}
                    >
                      <Tooltip
                        title={(  
                          <div>
                            <Typography variant="body1" component="div">{row.scanner.scanner_title}</Typography>
                            <Divider style={{marginTop: "0px", marginBottom: "8px", backgroundColor: 'white' }} />  
                            <Typography variant="body2" component="div"><span style={{fontWeight: "bold"}}>State: </span> {row.scanner.state_name}</Typography>  
                            <Typography variant="body2" component="div"><span style={{fontWeight: "bold"}}>County: </span> {row.scanner.county_name}</Typography>  
                          </div>  
                        )}
                      >    
                        <Radio />  
                      </Tooltip> 
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
            component="div"
            count={totalPages}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </>
  );
}
