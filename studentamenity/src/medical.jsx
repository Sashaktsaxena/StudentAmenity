// import React, { useState } from 'react';
// import axios from 'axios';

// const CreateAppointment = () => {
//   const [doctorType, setDoctorType] = useState('');
//   const [description, setDescription] = useState('');
//   const [appointmentDate, setAppointmentDate] = useState('');
//   const [appointment, setAppointment] = useState(null);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     const token = localStorage.getItem('token');

//     try {
//       const response = await axios.post('http://localhost:3002/appointments', {
//         doctorType,
//         description,
//         appointmentDate
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       setAppointment(response.data.appointment);
//     } catch (error) {
//       setError(error.response?.data?.message || 'An error occurred');
//     }
//   };

//   return (
//     <div>
//       <h2>Create Appointment</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Doctor Type:
//           <input type="text" value={doctorType} onChange={(e) => setDoctorType(e.target.value)} required />
//         </label>
//         <br />
//         <label>
//           Description:
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
//         </label>
//         <br />
//         <label>
//           Appointment Date:
//           <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
//         </label>
//         <br />
//         <button type="submit">Pay & Book Appointment</button>
//       </form>
//       {appointment && (
//         <div>
//           <h3>Appointment Details</h3>
//           <p>Doctor ID: {appointment.doctor_id}</p>
//           <p>Description: {appointment.description}</p>
//           <p>Appointment Date: {appointment.appointment_date}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateAppointment;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CreateAppointment = () => {
//   const [doctorType, setDoctorType] = useState('');
//   const [description, setDescription] = useState('');
//   const [appointmentDate, setAppointmentDate] = useState('');
//   const [appointment, setAppointment] = useState(null);
//   const [error, setError] = useState('');
//   const [doctorTypes, setDoctorTypes] = useState([]);

//   useEffect(() => {
//     const fetchDoctorTypes = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:3002/api/doctor-types');
//         setDoctorTypes(response.data);
//       } catch (error) {
//         console.error('Error fetching doctor types:', error);
//         setError('Failed to load doctor types');
//       }
//     };

//     fetchDoctorTypes();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     const token = localStorage.getItem('token');

//     try {
//       const response = await axios.post('http://localhost:3002/appointments', {
//         doctorType,
//         description,
//         appointmentDate
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       setAppointment(response.data.appointment);
//     } catch (error) {
//       setError(error.response?.data?.message || 'An error occurred');
//     }
//   };

//   return (
//     <div>
//       <h2>Create Appointment</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Doctor Type:
//           <select value={doctorType} onChange={(e) => setDoctorType(e.target.value)} required>
//             <option value="">Select a doctor type</option>
//             {doctorTypes.map((type) => (
//               <option key={type.id} value={type.type}>
//                 {type.type}
//               </option>
//             ))}
//           </select>
//         </label>
//         <br />
//         <label>
//           Description:
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
//         </label>
//         <br />
//         <label>
//           Appointment Date:
//           <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
//         </label>
//         <br />
//         <button type="submit">Pay & Book Appointment</button>
//       </form>
//       {appointment && (
//         <div>
//           <h3>Appointment Details</h3>
//           <p>Doctor Type: {appointment.doctor_id}</p>
//           <p>Description: {appointment.description}</p>
//           <p>Appointment Date: {appointment.appointment_date}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateAppointment;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CreateAppointment = () => {
//   const [doctorType, setDoctorType] = useState('');
//   const [description, setDescription] = useState('');
//   const [appointmentDate, setAppointmentDate] = useState('');
//   const [appointment, setAppointment] = useState(null);
//   const [error, setError] = useState('');
//   const [doctorTypes, setDoctorTypes] = useState([]);
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     const fetchDoctorTypes = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:3002/api/doctor-types');
//         setDoctorTypes(response.data);
//       } catch (error) {
//         console.error('Error fetching doctor types:', error);
//         setError('Failed to load doctor types');
//       }
//     };

//     const fetchAppointments = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:3002/api/appointments', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         setAppointments(response.data);
//       } catch (error) {
//         console.error('Error fetching appointments:', error);
//         setError('Failed to load appointments');
//       }
//     };

//     fetchDoctorTypes();
//     fetchAppointments();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     const token = localStorage.getItem('token');

//     try {
//       const response = await axios.post('http://localhost:3002/appointments', {
//         doctorType,
//         description,
//         appointmentDate
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       setAppointment(response.data.appointment);
//       setAppointments([...appointments, response.data.appointment]);
//     } catch (error) {
//       setError(error.response?.data?.message || 'An error occurred');
//     }
//   };

//   const handleCancelAppointment = async (appointmentId) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.delete(`http://localhost:3002/api/appointments/${appointmentId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       setAppointments(appointments.filter(app => app.id !== appointmentId));
//     } catch (error) {
//       console.error('Error canceling appointment:', error);
//       setError('Failed to cancel appointment');
//     }
//   };

//   return (
//     <div>
//       <h2>Create Appointment</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Doctor Type:
//           <select value={doctorType} onChange={(e) => setDoctorType(e.target.value)} required>
//             <option value="">Select a doctor type</option>
//             {doctorTypes.map((type) => (
//               <option key={type.id} value={type.type}>
//                 {type.type}
//               </option>
//             ))}
//           </select>
//         </label>
//         <br />
//         <label>
//           Description:
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
//         </label>
//         <br />
//         <label>
//           Appointment Date:
//           <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
//         </label>
//         <br />
//         <button type="submit">Pay & Book Appointment</button>
//       </form>
//       <h2>Your Appointments</h2>
//       {appointments.length > 0 ? (
//         appointments.map((appointment) => (
//           <div key={appointment.id}>
//             <p>Doctor Type: {appointment.doctor_id}</p>
//             <p>Description: {appointment.description}</p>
//             <p>Appointment Date: {appointment.appointment_date}</p>
//             {appointment.status === 'Scheduled' && (
//               <button onClick={() => handleCancelAppointment(appointment.id)}>Cancel Appointment</button>
//             )}
//           </div>
//         ))
//       ) : (
//         <p>No appointments found</p>
//       )}
//     </div>
//   );
// };

// export default CreateAppointment;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateAppointment = () => {
  const [doctorType, setDoctorType] = useState('');
  const [description, setDescription] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState('');
  const [doctorTypes, setDoctorTypes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorAvailabilities, setDoctorAvailabilities] = useState([]);

  useEffect(() => {
    const fetchDoctorTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/doctor-types');
        setDoctorTypes(response.data);
      } catch (error) {
        console.error('Error fetching doctor types:', error);
        setError('Failed to load doctor types');
      }
    };

    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3002/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments');
      }
    };

    const fetchDoctorAvailabilities = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/doctor-availabilities');
        setDoctorAvailabilities(response.data);
      } catch (error) {
        console.error('Error fetching doctor availabilities:', error);
        setError('Failed to load doctor availabilities');
      }
    };

    fetchDoctorTypes();
    fetchAppointments();
    fetchDoctorAvailabilities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:3002/appointments', {
        doctorType,
        description,
        appointmentDate
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setAppointment(response.data.appointment);
      setAppointments([...appointments, response.data.appointment]);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3002/api/appointments/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAppointments(appointments.filter(app => app.id !== appointmentId));
    } catch (error) {
      console.error('Error canceling appointment:', error);
      setError('Failed to cancel appointment');
    }
  };

  return (
    <div>
      <h2>Create Appointment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Doctor Type:
          <select value={doctorType} onChange={(e) => setDoctorType(e.target.value)} required>
            <option value="">Select a doctor type</option>
            {doctorTypes.map((type) => (
              <option key={type.id} value={type.type}>
                {type.type}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <br />
        <label>
          Appointment Date:
          <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Pay & Book Appointment</button>
      </form>

      <h2>Doctor Availability</h2>
      {doctorAvailabilities.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Specialty</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Available Time</th>
            </tr>
          </thead>
          <tbody>
            {doctorAvailabilities.map((availability) => (
              <tr key={availability.id}>
                <td>{availability.name}</td>
                <td>{availability.type}</td>
                <td>{availability.availability_start_date}</td>
                <td>{availability.availability_end_date}</td>
                <td>{availability.available_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No doctor availability found</p>
      )}

      <h2>Your Appointments</h2>
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div key={appointment.id}>
            <p>Doctor Type: {appointment.type}</p>
            <p>Description: {appointment.description}</p>
            <p>Appointment Date: {appointment.appointment_date}</p>
            <p>Doctor Name:{appointment.name}</p>
            <p>Appointment Time:{appointment.available_time}</p>
            {appointment.status === 'Scheduled' && (
              <button onClick={() => handleCancelAppointment(appointment.id)}>Cancel Appointment</button>
            )}
          </div>
        ))
      ) : (
        <p>No appointments found</p>
      )}
    </div>
  );
};

export default CreateAppointment;
