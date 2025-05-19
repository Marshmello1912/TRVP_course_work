import React, { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('darkly');

    useEffect(() => {
        const stored = localStorage.getItem('theme') || 'darkly';
        setTheme(stored);
        applyTheme(stored);
    }, []);

    const applyTheme = (themeName) => {
        let link = document.getElementById('theme-css');
        if (!link) {
            link = document.createElement('link');
            link.rel = 'stylesheet';
            link.id = 'theme-css';
            document.head.appendChild(link);
        }
        link.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${themeName}/bootstrap.min.css`;
    };

    const toggleTheme = () => {
        const next = theme === 'darkly' ? 'flatly' : 'darkly';
        setTheme(next);
        localStorage.setItem('theme', next);
        applyTheme(next);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
