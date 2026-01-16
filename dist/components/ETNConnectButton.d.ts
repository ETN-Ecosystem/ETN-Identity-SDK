import React from 'react';
interface ETNConnectButtonProps {
    clientId: string;
    redirectUri: string;
    scope?: string;
    state?: string;
    theme?: 'light' | 'dark';
    label?: string;
    style?: React.CSSProperties;
    className?: string;
}
export declare const ETNConnectButton: React.FC<ETNConnectButtonProps>;
export {};
