// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  RouterProvider,
  createRouter,
} from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

import { AuthProvider } from './context/AuthContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
    </AuthProvider>
  </React.StrictMode>
);