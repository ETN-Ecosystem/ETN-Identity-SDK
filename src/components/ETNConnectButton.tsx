import React from 'react';
import { ETNAuthClient } from '../client';

interface ETNConnectButtonProps {
    clientId: string;
    redirectUri: string;
    scope?: string;
    state?: string; // Optional state for CSRF protection
    theme?: 'light' | 'dark';
    label?: string;
    style?: React.CSSProperties;
    className?: string; // Allow custom classes if needed
}

export const ETNConnectButton: React.FC<ETNConnectButtonProps> = ({
    clientId,
    redirectUri,
    scope,
    state,
    theme = 'dark',
    label = 'Sign in with ETN',
    style,
    className,
}) => {
    const handleLogin = () => {
        // Generate a random state if not provided
        const finalState = state || Math.random().toString(36).substring(7);

        const client = new ETNAuthClient({
            clientId,
            redirectUri,
            scope,
        });

        const authUrl = client.buildAuthorizeUrl(finalState);
        window.location.href = authUrl;
    };

    // Base styles for the button (Zero-dependency approach)
    const baseStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.2s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        ...style,
    };

    const themeStyles: Record<string, React.CSSProperties> = {
        dark: {
            backgroundColor: '#000000', // Deep black as requested
            color: '#FFFFFF',
        },
        light: {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            border: '1px solid #E5E7EB',
        },
    };

    const currentThemeStyle = theme === 'dark' ? themeStyles.dark : themeStyles.light;

    return (
        <button
            onClick={handleLogin}
            style={{ ...baseStyle, ...currentThemeStyle }}
            className={className}
            aria-label={label}
            type="button"
        >
            <img
                src="/etn-identity.svg"
                alt="ETN Logo"
                width="20"
                height="20"
                style={{ flexShrink: 0 }}
            />
            <span>{label}</span>
        </button>
    );
};
