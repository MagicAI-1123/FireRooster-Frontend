"use client";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Grid,
  TablePagination,
} from "@mui/material";
import { useState, useEffect } from "react";
import { userlistService } from "@/services/userlist";
import AddNewUserModal from "@/components/userlist/addNewModal";
import EditUserModal from "@/components/userlist/editModal";

interface User {
    id: number;
    email: string;
    phone_number: string;
    full_name: string;
    security_pin: string;
    status: string;
    permission: string;
    device: string;
    browser: string;
    os: string;
    city: string;
    country: string;
    region: string;
    ipaddress: string;
    countryCode: string;
    current_visits: number;
    day_visits: number;
}

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissionFilter, setPermissionFilter] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSearch = () => {
    // Implement search logic here
    console.log("Searching with filters:", { searchTerm, permissionFilter });
  };

  useEffect(() => {
    userlistService.getUserStatus()
      .then(response => response.data)
      .then(result => {
        setUsers(result);
        console.log("result", result);
      })
  }, []);

  const fetchUsers = () => {
    userlistService.getUserStatus()
      .then(response => response.data)
      .then(result => {
        setUsers(result);
      });
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between mb-4 items-center p-4 bg-white rounded">
        <div className="font-semibold text-xl text-coolGray-800 mb-4 sm:mb-0">Userlist</div>
        <Button
          variant="contained"
          onClick={handleOpenModal}
          fullWidth={isMobile}
          sx={{
            backgroundColor: "#E74C3C",
            "&:hover": { backgroundColor: "#C0392B" }
          }}
        >
          Add New User
        </Button>
      </div>
      <Divider />

      <Paper className="mt-6 p-4">
        <div className={`${isMobile ? 'flex flex-col' : 'flex'} gap-4 mb-4`}>
          <TextField
            size="small"
            placeholder="Search By Name, Phone Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth={isMobile}
            sx={{ width: isMobile ? '100%' : '300px' }}
          />
          <FormControl 
            size="small" 
            fullWidth={isMobile}
            sx={{ width: isMobile ? '100%' : '300px' }}
          >
            <InputLabel>Permissions</InputLabel>
            <Select
              value={permissionFilter}
              label="Permissions"
              onChange={(e) => setPermissionFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="MANAGER">MANAGER</MenuItem>
              <MenuItem value="SALES">SALES</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="contained"
            onClick={handleSearch}
            fullWidth={isMobile}
            sx={{
              backgroundColor: "#E74C3C",
              "&:hover": { backgroundColor: "#C0392B" }
            }}
          >
            Search
          </Button>
        </div>

        {isMobile ? (
          <div>
            {users && users.length > 0 ? (
              users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                <Card key={user.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {user.full_name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>Permission:</span> {user.permission || "No Permission"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>Status:</span> {user.status || "Active"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>Email:</span> {user.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>Phone:</span> {user.phone_number || '-'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>Security PIN:</span> {user.security_pin || ''}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>IP:</span> {user.ipaddress}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>Device:</span> {user.device}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>Browser:</span> {user.browser}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>OS:</span> {user.os}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>Location:</span> {`${user.city}, ${user.region}, ${user.country}`}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>Current Visits:</span> {user.current_visits}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>Day Visits:</span> {user.day_visits}
                    </Typography>
                    <Button 
                      size="small" 
                      onClick={() => handleOpenEditModal(user)}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography align="center">No users found</Typography>
            )}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Permission</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Full Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Phone</TableCell>
                  <TableCell align="center">Security PIN</TableCell>
                  <TableCell align="center">IP Address</TableCell>
                  <TableCell align="center">Device</TableCell>
                  <TableCell align="center">Browser</TableCell>
                  <TableCell align="center">OS</TableCell>
                  <TableCell align="center">Location</TableCell>
                  <TableCell align="center">Current Visits</TableCell>
                  <TableCell align="center">Day Visits</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell align="center">{user.permission ? user.permission : "No Permission"}</TableCell>
                      <TableCell align="center">{user.status ? user.status : "Active"}</TableCell>
                      <TableCell align="center">{user.full_name}</TableCell>
                      <TableCell align="center">{user.email}</TableCell>
                      <TableCell align="center">{user.phone_number || '-'}</TableCell>
                      <TableCell align="center">{user.security_pin ? user.security_pin : ""}</TableCell>
                      <TableCell align="center">{user.ipaddress}</TableCell>
                      <TableCell align="center">{user.device}</TableCell>
                      <TableCell align="center">{user.browser}</TableCell>
                      <TableCell align="center">{user.os}</TableCell>
                      <TableCell align="center">{`${user.city}, ${user.region}, ${user.country}`}</TableCell>
                      <TableCell align="center">{user.current_visits}</TableCell>
                      <TableCell align="center">{user.day_visits}</TableCell>
                      <TableCell align="center">
                        <Button 
                          size="small" 
                          onClick={() => handleOpenEditModal(user)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={14} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <AddNewUserModal isOpen={isModalOpen} onClose={handleCloseModal} onSuccess={fetchUsers} />
      <EditUserModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={fetchUsers}
        userData={selectedUser!}
      />
    </>
  );
}
