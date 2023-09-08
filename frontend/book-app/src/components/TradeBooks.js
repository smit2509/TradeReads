import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const TradeBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const { bookId } = useParams();

  useEffect(() => {
    // Fetch user's books from the API endpoint
    const email = localStorage.getItem('email');
    fetch(`${process.env.REACT_APP_API_URL}/book/owner/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
    // Filter books based on the search term and book status
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.book_status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply status filter if selected
    if (statusFilter !== '') {
      setFilteredBooks(filtered.filter((book) => book.book_status.toLowerCase() === statusFilter.toLowerCase()));
    } else {
      setFilteredBooks(filtered);
    }
  }, [searchTerm, statusFilter, books]);

  const handleTradeRequest = (bookId, offeredBookId) => {
    fetch(`${process.env.REACT_APP_API_URL}/traderequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookId1:bookId,
        bookId2:offeredBookId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data here if needed
        console.log(data);
        // Show a success toast
        toast.success('Trade request sent successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error('Error sending trade request:', error);
        // Show an error toast
        toast.error('Error sending trade request', {
          position: 'top-right',
          autoClose: 3000,
        });
      });
  };

  return (
    <div className="container mt-4">
      <h2>My Books</h2>
      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, author, or genre"
        />
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="traded">Traded</option>
          <option value="gave away">Gave Away</option>
        </select>
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
                <p className="card-text">Status: {book.book_status}</p>
              </div>
              <div className="d-flex">
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-success mx-2 my-2"
                    onClick={() => handleTradeRequest(bookId,book.book_id)}
                  >
                    Trade Request
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

export default TradeBooks;
