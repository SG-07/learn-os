// frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

import { AuthProvider } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/ThemeContext";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />

        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);
