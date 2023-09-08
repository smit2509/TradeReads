import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBook = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    release_year: '',
    book_owner: '',
    book_status: '',
  });

  useEffect(() => {
    // Fetch book data based on bookId from the API endpoint
    fetch(`${process.env.REACT_APP_API_URL}/books/${bookId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include any authentication headers if required
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFormData({
          title: data.title,
          author: data.author,
          description: data.description,
          genre: data.genre,
          release_year: data.release_year,
          book_owner: data.book_owner,
          book_status: data.book_status,
        });
      })
      .catch((error) => {
        console.error('Error fetching book:', error);
      });
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Assuming the API returns a success message
      
      toast.success("Edited Successfully!");
      navigate('/mybooks');

      // Redirect to the MyBooks page after successful update
    } catch (error) {
      console.error('Error editing book:', error);
      toast.error('Error editing book. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="author" className="form-label">
            Author:
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="genre" className="form-label">
            Genre:
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="release_year" className="form-label">
            Release Year:
          </label>
          <input
            type="number"
            id="release_year"
            name="release_year"
            value={formData.release_year}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>


        <div className="mb-3">
          <label htmlFor="book_status" className="form-label">
            Status:
          </label>
          <select
            id="book_status"
            name="book_status"
            value={formData.book_status}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select Status</option>
            <option value="available">Available</option>
            <option value="Traded">Traded</option>
            <option value="Gave Away">Gave Away</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditBook;
