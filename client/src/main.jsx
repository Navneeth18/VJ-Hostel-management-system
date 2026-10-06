import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { UserProvider } from './context/UserContext';
import { AdminProvider } from './context/AdminContext';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <AdminProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AdminProvider>
    </UserProvider>
  </StrictMode>
);
