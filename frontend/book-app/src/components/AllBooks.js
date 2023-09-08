import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    // Fetch all books from the API endpoint
    fetch(`${process.env.REACT_APP_API_URL}/books`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include any authentication headers if required
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, []);

  useEffect(() => {
    // Filter books based on the search term
    const filtered = books.filter((book) => {
      // Check if the book owner's email is not equal to the current user's email
      // Also, check if the book status is "available"
      return book.book_owner !== localStorage.getItem('email') && book.book_status === 'available' &&
        (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleTradeRequest = (bookId) => {
    navigate(`/tradebook/${bookId}`);
  };

  const handleTakeRequest = (bookTitle, bookOwnerEmail) => {
    const userEmail = localStorage.getItem('email'); // Replace with the current user's email address

    // Create the request body for the API call
    const requestBody = {
      bookTitle,
      bookOwnerEmail,
      userEmail,
    };
    // Make the POST request to the '/take-request' API endpoint
    fetch(`${process.env.REACT_APP_API_URL}/takerequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data here if needed
        console.log(data);
        // Show a success toast
        toast.success('Email sent successfully');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        // Show an error toast
        toast.error('Error sending email');
      });
  };

  return (
    <div className="container mt-4">
      <h2>All Books</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control me-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, author, or genre"
        />
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredBooks.map((book) => (
          <div key={book.book_id} className="col">
            <div className="card h-100">
              <div className="card-body mb-3">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">Author: {book.author}</p>
                <p className="card-text">Genre: {book.genre}</p>
                <p className="card-text">Release Year: {book.release_year}</p>
                <p className="card-text">Description: {book.description}</p>
              </div>
              <div className="d-flex">
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-success mx-2 my-2"
                    onClick={() => handleTradeRequest(book.book_id)}
                  >
                    Trade
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-danger mx-2 my-2"
                    onClick={() => handleTakeRequest(book.title, book.book_owner)}
                  >
                    Take Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AllBooks;
