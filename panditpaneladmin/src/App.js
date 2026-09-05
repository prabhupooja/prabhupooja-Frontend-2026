import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const Login = lazy(() => import('./components/Login/login'));
const Mainhome = lazy(() => import('./pages/Mainhome'));
const Otp = lazy(() => import('./components/Otp/otp'));

const AdminAppLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <div style={{ width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #ff7a00", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<AdminAppLoader />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/*" element={<Mainhome />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
