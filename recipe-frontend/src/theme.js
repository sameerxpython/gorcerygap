// Premium Color Palette
const palette = {
    primary: {
        main: '#6366f1', // Indigo 500
        light: '#818cf8',
        dark: '#4f46e5',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#10b981', // Emerald 500
        light: '#34d399',
        dark: '#059669',
        contrastText: '#ffffff',
    },
    error: {
        main: '#ef4444', // Red 500
    },
    warning: {
        main: '#f59e0b', // Amber 500
    },
    info: {
        main: '#3b82f6', // Blue 500
    },
    success: {
        main: '#10b981',
    },
    background: {
        default: '#f8fafc', // Slate 50
        paper: '#ffffff',
    },
    text: {
        primary: '#1e293b', // Slate 800
        secondary: '#64748b', // Slate 500
    },
};

export const themeSettings = {
    palette,
    typography: {
        fontFamily: '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif',
        h1: { fontWeight: 700, letterSpacing: '-0.025em' },
        h2: { fontWeight: 700, letterSpacing: '-0.025em' },
        h3: { fontWeight: 600, letterSpacing: '-0.025em' },
        h4: { fontWeight: 600, letterSpacing: '-0.025em' },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    },
                },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    border: '1px solid #e2e8f0', // Slate 200
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
    },
};
