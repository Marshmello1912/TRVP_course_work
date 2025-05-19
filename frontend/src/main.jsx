import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import 'bootswatch/dist/darkly/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {AuthProvider} from "./context/AuthContext.jsx";
import { ThemeProvider } from './context/ThemeContext.jsx';


ReactDOM
    .createRoot(document.getElementById('root'))
    .render(
        <BrowserRouter>
            <AuthProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    );
