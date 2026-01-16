var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ETNAuthClient } from '../client';
export var ETNConnectButton = function (_a) {
    var clientId = _a.clientId, redirectUri = _a.redirectUri, scope = _a.scope, state = _a.state, _b = _a.theme, theme = _b === void 0 ? 'dark' : _b, _c = _a.label, label = _c === void 0 ? 'Sign in with ETN' : _c, style = _a.style, className = _a.className;
    var handleLogin = function () {
        // Generate a random state if not provided
        var finalState = state || Math.random().toString(36).substring(7);
        var client = new ETNAuthClient({
            clientId: clientId,
            redirectUri: redirectUri,
            scope: scope,
        });
        var authUrl = client.buildAuthorizeUrl(finalState);
        window.location.href = authUrl;
    };
    // Base styles for the button (Zero-dependency approach)
    var baseStyle = __assign({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'all 0.2s ease', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }, style);
    var themeStyles = {
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
    var currentThemeStyle = theme === 'dark' ? themeStyles.dark : themeStyles.light;
    return (_jsxs("button", { onClick: handleLogin, style: __assign(__assign({}, baseStyle), currentThemeStyle), className: className, "aria-label": label, type: "button", children: [_jsx("img", { src: "/etn-identity.svg", alt: "ETN Logo", width: "20", height: "20", style: { flexShrink: 0 } }), _jsx("span", { children: label })] }));
};
