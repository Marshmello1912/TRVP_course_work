import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '.context/AuthContext';
import 'bootswatch/dist/darkly/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';


ReactDOM
    .createRoot(document.getElementById('root'))
    .render(
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    );
