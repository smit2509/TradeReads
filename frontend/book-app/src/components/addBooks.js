import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    year: '', // Corrected the name attribute
    owner: localStorage.getItem('email'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Assuming the API returns a success message
      const data = await response.json();
      toast.success(data.message, {
        position: 'top-right',
        autoClose: 3000,
      });
      console.log(localStorage.getItem('email'))
      navigate('/mybooks')

      // Clear the form after successful submission
      setFormData({
        title: '',
        author: '',
        description: '',
        genre: '',
        year: '', // Reset the year value to empty string
        owner: localStorage.getItem('user_id'),
      });
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Error adding book. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author:</label>
          <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="genre" className="form-label">Genre:</label>
          <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="year" className="form-label">Year:</label> {/* Updated the name attribute */}
          <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} className="form-control" required />
        </div>

        <button type="submit" className="btn btn-primary">Add Book</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddBook;
