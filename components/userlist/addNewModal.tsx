import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import { userlistService } from "@/services/userlist";
import { useAppSelector } from "@/hooks/store.hooks";

interface AddNewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  full_name: string;
  phone_number: string;
  email: string;
  security_pin: string;
  permission: string;
  confirmPin: string;
}

export default function AddNewUserModal({ isOpen, onClose, onSuccess }: AddNewUserModalProps) {
  const user = useAppSelector(state => state.auth?.user);

  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    phone_number: "",
    email: "",
    security_pin: "",
    permission: "",
    confirmPin: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.full_name) newErrors.full_name = "Full Name is required";
    if (!formData.phone_number) newErrors.phone_number = "Phone is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.security_pin) {
      newErrors.security_pin = "PIN is required";
    } else if (formData.security_pin.length < 4) {
      newErrors.security_pin = "PIN must be at least 4 characters";
    }
    if (!formData.confirmPin) {
      newErrors.confirmPin = "Confirm PIN is required";
    } else if (formData.security_pin !== formData.confirmPin) {
      newErrors.confirmPin = "PINs do not match";
    }
    if (!formData.permission) newErrors.permission = "Permission is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      await userlistService.insertUserStatus({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        email: formData.email,
        security_pin: formData.security_pin,
        permission: formData.permission,
      });

      setSnackbar({
        open: true,
        message: "User added successfully",
        severity: "success",
      });

      // Reset form and close modal after successful submission
      setFormData({
        full_name: "",
        phone_number: "",
        email: "",
        security_pin: "",
        permission: "",
        confirmPin: "",
      });
      
      onSuccess();
      setTimeout(onClose, 1500);

    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add user",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add Team Member</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!!errors.full_name}
              helperText={errors.full_name}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!!errors.phone_number}
              helperText={errors.phone_number}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              type="email"
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="PIN"
              name="security_pin"
              value={formData.security_pin}
              onChange={handleInputChange}
              margin="normal"
              required
              type="password"
              error={!!errors.security_pin}
              helperText={errors.security_pin}
            />
            <TextField
              fullWidth
              label="Confirm PIN"
              name="confirmPin"
              value={formData.confirmPin}
              onChange={handleInputChange}
              margin="normal"
              required
              type="password"
              error={!!errors.confirmPin}
              helperText={errors.confirmPin}
            />
            <FormControl fullWidth margin="normal" error={!!errors.permission}>
              <InputLabel>User Permissions</InputLabel>
              <Select
                label="User Permissions"
                name="permission"
                value={formData.permission}
                onChange={handleSelectChange}
              >
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="MANAGER">MANAGER</MenuItem>
                <MenuItem value="SALES">SALES</MenuItem>
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#E74C3C",
                "&:hover": { backgroundColor: "#C0392B" }
              }}
            >
              Add Team Member
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}