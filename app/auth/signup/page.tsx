"use client";
import { Alert, Snackbar, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import authService from "@/services/auth";
import { useRouter } from "next/navigation";
import { useErrorMessage } from "@/hooks/useGlobalError";
import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const signupSchema = z
  .object({
    email: z.string().email("Please provide a valid email"),
    first_name: z.string().min(1, "Field is required"),
    last_name: z.string().min(1, "Field is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    password2: z.string().min(1, "Passwords must match"),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });
type TSignupSchema = z.infer<typeof signupSchema>;

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
  } = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [openSnack, setOpenSnack] = useState(false);
  const { errorMessage, handleError, clearErrorMessage } = useErrorMessage();

  const onSubmit = async (data: TSignupSchema) => {
    try {
      await authService.signUp(data);
      clearErrorMessage();
      reset();
      router.push("/auth/login");
    } catch (error) {
      handleError(error);
      handleOpenSnack();
      console.log("Signup error: ", error);
    }
  };

  const handleOpenSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnack(false);
  };

  return (
    <div className={`flex flex-col items-center justify-center h-auto py-8 p-4 ${isMobile ? 'w-full' : 'w-[480px] mx-auto'}`}>
      <div className="w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-2xl font-bold mb-4 text-center">Sign up</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("first_name", { value: getValues("first_name") })}
            error={Boolean(errors?.first_name?.message)}
            variant="outlined"
            label="First name"
            helperText={errors?.first_name?.message}
            onChange={(e) => setValue("first_name", e.target.value)}
            fullWidth
            size={isMobile ? "small" : "medium"}
          />
          <TextField
            {...register("last_name", { value: getValues("last_name") })}
            error={Boolean(errors?.last_name?.message)}
            variant="outlined"
            label="Last name"
            helperText={errors?.last_name?.message}
            onChange={(e) => setValue("last_name", e.target.value)}
            fullWidth
            size={isMobile ? "small" : "medium"}
          />
          <TextField
            {...register("email", { value: getValues("email") })}
            error={Boolean(errors?.email?.message)}
            variant="outlined"
            label="Email"
            helperText={errors?.email?.message}
            onChange={(e) => setValue("email", e.target.value)}
            fullWidth
            size={isMobile ? "small" : "medium"}
          />
          <TextField
            {...register("password", { value: getValues("password") })}
            error={Boolean(errors?.password?.message)}
            variant="outlined"
            label="Password"
            type="password"
            helperText={errors?.password?.message}
            onChange={(e) => setValue("password", e.target.value)}
            fullWidth
            size={isMobile ? "small" : "medium"}
          />
          <TextField
            {...register("password2", { value: getValues("password2") })}
            error={Boolean(errors?.password2?.message)}
            variant="outlined"
            label="Confirm password"
            type="password"
            helperText={errors?.password2?.message}
            onChange={(e) => setValue("password2", e.target.value)}
            fullWidth
            size={isMobile ? "small" : "medium"}
          />
          <div className="text-sm pt-1">
            By accessing this site, you agree to the{" "}
            <a
              className="text-gray-400 hover:underline hover:text-gray-500"
              href="#"
            >
              Terms of Service
            </a>
          </div>
          <LoadingButton
            sx={{
              [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
              background: "rgb(30, 41, 59)",
              padding: isMobile ? '8px 16px' : '10px 20px',
              width: '100%',
              marginTop: '4px',
            }}
            loading={isSubmitting}
            variant="contained"
            type="submit"
          >
            Sign up
          </LoadingButton>
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 pt-1">
            <div>
              Already have an account?
              <Link
                className="text-gray-400 hover:underline hover:text-gray-500 mx-1"
                href="login"
              >
                Log in
              </Link>
            </div>
          </div>
        </form>
      </div>
      {errorMessage && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={openSnack}
          autoHideDuration={3000}
          onClose={handleCloseSnack}
        >
          <Alert severity="error" variant="filled" onClose={handleCloseSnack}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

