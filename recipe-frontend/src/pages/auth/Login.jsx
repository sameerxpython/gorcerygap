import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Paper, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await login(values.email, values.password);
                enqueueSnackbar('Login successful!', { variant: 'success' });
                navigate('/app/dashboard');
            } catch (error) {
                enqueueSnackbar(error.response?.data?.message || 'Invalid credentials', { variant: 'error' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                p: 2,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    maxWidth: 400,
                    width: '100%',
                    borderRadius: 2,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
                    Welcome Back
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={3}>
                    Sign in to access your smart pantry.
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email Address"
                        margin="normal"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        margin="normal"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        type="submit"
                        size="large"
                        disabled={formik.isSubmitting}
                        sx={{ mt: 3, mb: 2, borderRadius: 2 }}
                    >
                        {formik.isSubmitting ? 'Logging in...' : 'Log In'}
                    </Button>
                </form>

                <Box mt={2}>
                    <Typography variant="body2">
                        Don't have an account?{' '}
                        <Link to="/auth/register" style={{ textDecoration: 'none' }}>
                            <MuiLink component="span" fontWeight="medium">
                                Sign Up
                            </MuiLink>
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}
