import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the data from local storage and navigate to the home page
    localStorage.clear();
    navigate('/');
  };

  // Check if there is something in local storage to determine whether to show the navbar
  const isLoggedIn = !!localStorage.getItem('email');

  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
      <Link className="navbar-brand d-flex align-items-center" to="/books">
          <img src="/images.png" alt="Logo" width="40" height="40" className="me-2" />
          TradeReads
        </Link>
        {isLoggedIn && (
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/addbook">
                Add Book
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mybooks">
                My Books
              </Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger nav-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
