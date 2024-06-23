// src/components/StudentManagement.js
import React, { useState } from 'react';
import axios from 'axios';

const StudentManagement = () => {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [course, setCourse] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/api/students/${studentId}`);
      setStudent(response.data);
      setName(response.data.name);
      setContact(response.data.contact);
      setCourse(response.data.course);
    } catch (error) {
        console.error("Error:", error);
        if (error.response && error.response.status === 404) {
            console.log("user not found");
        }  else{
            console.error("any other error occurred");
        }
   
    }
  };

  const handleEdit = async () => {
    try {
      await axios.patch(`http://localhost:3002/api/students/${studentId}`, { name, contact, course });
      setEditMode(false);
      handleSearch();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3002/api/students/${studentId}`);
      setStudent(null);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div>
      <h3>Student Management</h3>
      <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Student ID" />
      <button onClick={handleSearch}>Search</button>
      {student && (
        <div>
          {editMode ? (
            <div>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
              <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
              <button onClick={handleEdit}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>Name: {student.name}</p>
              <p>Contact: {student.contact}</p>
              <p>Course: {student.course}</p>
              <button onClick={() => setEditMode(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
