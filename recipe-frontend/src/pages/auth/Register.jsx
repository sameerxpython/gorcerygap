import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Paper, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await register(values.name, values.email, values.password);
                enqueueSnackbar('Registration successful! Welcome!', { variant: 'success' });
                navigate('/app/dashboard');
            } catch (error) {
                enqueueSnackbar(error.response?.data?.message || 'Registration failed', { variant: 'error' });
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
                    Join Us
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={3}>
                    Create your account to start managing your pantry and recipes.
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Full Name"
                        margin="normal"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
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
                        {formik.isSubmitting ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <Box mt={2}>
                    <Typography variant="body2">
                        Already have an account?{' '}
                        <Link to="/auth/login" style={{ textDecoration: 'none' }}>
                            <MuiLink component="span" fontWeight="medium">
                                Log In
                            </MuiLink>
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}
