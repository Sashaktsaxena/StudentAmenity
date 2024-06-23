import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
const GymPaymentPage = () => {
    const [gymTime, setGymTime] = useState('');
    const [monthPaid, setMonthPaid] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(
          'http://localhost:3002/gym/register',
          { gymTime, monthPaid },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage(response.data.message);
        window.location.reload();
      } catch (error) {
        setMessage(error.response.data.message);
      }
    };
  
    return (
      <div>
        <h2>Gym Registration and Payment</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Gym Time:</label>
            <select value={gymTime} onChange={(e) => setGymTime(e.target.value)}>
              <option value="">Select Time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
          <div>
            <label>Month Paid:</label>
            <input
              type="text"
              value={monthPaid}
              onChange={(e) => setMonthPaid(e.target.value)}
              placeholder="e.g. June"
            />
          </div>
          <button type="submit">Pay</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    );
  };
  export default GymPaymentPage;