import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddBook from './components/addBooks';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import MyBooks from './components/MyBooks';
import EditBook from './components/EditBook';
import AllBooks from './components/AllBooks';
import TradeBooks from './components/TradeBooks';
import Navbar from './components/Navbar'; // Import the Navbar component

function App() {
  return (
    <Router>
      <div>
        <Navbar /> 
        <div className="container" style={{ marginBottom: '2rem' }}>
          <Routes>
            <Route path="/addbook" element={<AddBook />} />
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/mybooks" element={<MyBooks />} />
            <Route path="/editbook/:bookId" element={<EditBook />} />
            <Route path="/books" element={<AllBooks />} />
            <Route path="/tradebook/:bookId" element={<TradeBooks />} />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
