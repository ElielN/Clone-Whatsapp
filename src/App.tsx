import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import { ContactContextProvider } from './contexts/ContactContext';
import { Home } from './pages/Home';
import { SignInPage } from './pages/SignInPage';
import './styles/global.scss';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ContactContextProvider>
          <Routes>
            <Route path='/' element={<SignInPage />} />
            <Route path='/home' element={<Home />}/>
          </Routes>
        </ContactContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
