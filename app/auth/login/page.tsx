'use client';
import { Alert, CircularProgress, SelectChangeEvent, Snackbar, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth';
import { useState, useEffect } from 'react';
import { useErrorMessage } from '@/hooks/useGlobalError';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '@/hooks/store.hooks';
import { setUserData } from '@/store/slices/auth.slice';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { billingService } from '@/services/billing';
import { State } from '@/services/types/billing.type';
import { detectDevice } from '@/components/userlist/detectDevice';
import { detectBrowser } from '@/components/userlist/detectDevice';
import { getLocation } from '@/components/userlist/detectDevice';
import { detectOS } from '@/components/userlist/detectDevice';

const loginSchema = z.object({
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    
});

type TLoginSchema = z.infer<typeof loginSchema>;

export default function Page() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        getValues,
        setValue,
    } = useForm<TLoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const router = useRouter();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [openSnack, setOpenSnack] = useState(false);
    const { errorMessage, handleError, clearErrorMessage } = useErrorMessage();

    const [isMobileWidth, setIsMobileWidth] = useState(false);

    const [states, setStates] = useState<State[]>([]);
    const [selectedState, setSelectedState] = useState<State | "">("");
    const [selectedCounty, setSelectedCounty] = useState<string | "">("");
    const [uploadDisabled, setUploadDisabled] = useState(false);

    const fetchStates = async () => {
        const res = await billingService.getStateList();
        setStates(res);
    };

    const handleStateChange = (e: SelectChangeEvent) => {  
        const id = e.target.value;  
        const state = states.find((item) => item.state_id === id);  
  
        // If state is undefined, setSelectedCounty to "" and provide a default value for setSelectedState  
        if (!state) {  
            setSelectedCounty("");  
            setSelectedState(""); // Or handle this scenario as needed  
        } else {  
            setSelectedState(state);  
        }  
    };

    const handleCountyChange = (e: SelectChangeEvent) => {
        const id = e.target.value;
        setSelectedCounty(id);
    };

    useEffect(() => {
        if (window.innerWidth < 640) {
            setIsMobileWidth(true);
        } else {
            setIsMobileWidth(false);
        }
    }, []);

    const onSubmit = async (data: TLoginSchema) => {
        try {
            const device = detectDevice(navigator);
            const browser = detectBrowser(navigator);
            const os = detectOS(navigator);
            const location = await getLocation();
            const ipaddress = location?.query;

            const loginData = {
                ...data,
                device,
                browser,
                os,
                ipaddress
            };

            const resp = await authService.logIn(loginData);
            clearErrorMessage();
            const authToken = resp?.access_token;
            if (authToken) localStorage.setItem('auth', authToken);
            const user = resp?.user;
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                dispatch(setUserData(user));
            }
            reset();
            router.push('/dashboard/alerts');
        } catch (error) {
            handleError(error);
            handleOpenSnack();
        }
    };

    const handleOpenSnack = () => {
        setOpenSnack(true);
    };

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpenSnack(false);
    };

    return (
        <div className={`flex flex-col items-center justify-center h-auto py-8 p-4 ${isMobile ? 'w-full' : 'w-[480px] mx-auto'}`}>
            <div className="w-full bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl font-bold mb-6 text-center">Sign in</div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <TextField
                        {...register('email', { value: getValues('email') || '' })}
                        error={Boolean(errors?.email?.message)}
                        variant="outlined"
                        label="Email"
                        helperText={errors?.email?.message}
                        onChange={(e) => setValue('email', e.target.value)}
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                    />
                    <TextField
                        {...register('password', { value: getValues('password') || '' })}
                        error={Boolean(errors?.password?.message)}
                        variant="outlined"
                        label="Password"
                        type="password"
                        helperText={errors?.password?.message}
                        onChange={(e) => setValue('password', e.target.value)}
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                    />
                    <div className="text-sm sm:text-base">
                        By accessing this site, you agree to the{' '}
                        <a className="text-gray-400 hover:underline hover:text-gray-500" href="#">
                            Terms of Service
                        </a>
                    </div>
                    <LoadingButton
                        sx={{
                            [`&:hover`]: { background: 'rgba(30, 41, 59, 0.8)' },
                            background: 'rgb(30, 41, 59)',
                            padding: isMobile ? '8px 16px' : '10px 20px',
                            width: '100%',
                        }}
                        loading={isSubmitting}
                        variant="contained"
                        type="submit"
                    >
                        Sign in
                    </LoadingButton>
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                        <div>
                            Don&apos;t have an account?
                            <Link className="text-gray-400 hover:underline hover:text-gray-500 mx-1" href="signup">
                                Sign up
                            </Link>
                        </div>
                        <a className="text-gray-400 hover:underline hover:text-gray-500" href="#">
                            Forgot password
                        </a>
                    </div>
                </form>
            </div>

            {errorMessage && (
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
