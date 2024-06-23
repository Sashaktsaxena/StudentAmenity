

// import React, { useState } from "react";
// import axios from "axios";
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser, faIdCard, faPhone, faBook, faLock } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons


// function SignStud() {
//     const [formdata, setdata] = useState({
//         name: '',
//         StudentId: '',
//         Contact: '',
//         Course: '',
//         Password: ''
//     });

//     const [isFocused, setIsFocused] = useState(false);
//     const[isfocussed1,setIsFocused1]=useState(false);

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         try {
//             const response = await axios.post('http://localhost:3002/getinfo', formdata);
//             console.log("Response from backend:", response.data);
//             if(response.status===200){
//                 window.location.href='http://localhost:3000/login';
//             }
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     };

//     const HandleEvent = (event) => {
//         const { name, value } = event.target;
//         setdata({ ...formdata, [name]: value });
//     };

//     const handleFocus = () => {
//         setIsFocused(true);
//     };

//     const handleBlur = () => {
//         setIsFocused1(false);
//     };

//     return (
//         <div className="outer">
//             <div className="innerleft">
//                 <div className="image"></div>
//             </div>
//             <div className="innerright">
//                 <div className="head"><h1>Student Registration Form</h1></div>
//                 <div><h4>Enter the details below</h4></div>
//                 <form onSubmit={handleSubmit}>
//                     <div className={`input-container ${isFocused ? 'focused' : ''}`}>
//                         <FontAwesomeIcon icon={faIdCard} className="icon" />
//                         <input type="number" placeholder="Enter StudentId" name="StudentId" value={formdata.StudentId} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
//                     </div>
//                     <div className={`input-container ${isFocused ? 'focused' : ''}`}>
//                         <FontAwesomeIcon icon={faUser} className="icon" />
//                         <input type="text" placeholder="Enter name" name="name" value={formdata.name} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
//                     </div>
//                     <div className={`input-container ${isFocused ? 'focused' : ''}`}>
//                         <FontAwesomeIcon icon={faPhone} className="icon" />
//                         <input type="number" placeholder="Enter Phone no." name="Contact" value={formdata.Contact} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
//                     </div>
//                     <div className={`input-container ${isFocused ? 'focused' : ''}`}>
//                         <FontAwesomeIcon icon={faBook} className="icon" />
//                         <input type="text" placeholder="Enter course" name="Course" value={formdata.Course} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
//                     </div>
//                     <div className={`input-container ${isFocused ? 'focused' : ''}`}>
//                         <FontAwesomeIcon icon={faLock} className="icon" />
//                         <input type="password" placeholder="Enter password" name="Password" value={formdata.Password} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
//                     </div>
//                     <div className="submit-container">
//                         <input type='submit' className="submit-button"  />
//                     </div>
//                 </form>
//                 <Link to={'/login'}><a>Already a user</a></Link>
//             </div>
//         </div>
//     )
// }

// export default SignStud;
import React, { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faPhone, faBook, faLock, faKey,faCamera } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons

function SignStud() {
    const [formdata, setdata] = useState({
        name: '',
        StudentId: '',
        Contact: '',
        Course: '',
        Password: '',
        secret:'',
        photo: null 
    });

    const [isFocused, setIsFocused] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        for (const key in formdata) {
            data.append(key, formdata[key]);
        }
        try {
            const response = await axios.post('http://localhost:3002/getinfo', data,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Response from backend:", response.data);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                window.location.href = 'http://localhost:3000/profile';
            }
        } catch (error) {
            if (error.response.status === 400) {
                // Display error message for invalid contact number
                setError(error.response.data.message);
            } else {
                console.error("Error is :", error);
            }
        }
    };
    const handleFileChange=(event)=>{
        setdata({...formdata,photo:event.target.files[0]})
    }
    const HandleEvent = (event) => {
        const { name, value } = event.target;
        setdata({ ...formdata, [name]: value });
    };
    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <div className="outer">
            <div className="innerleft">
                <div className="image"></div>
            </div>
            <div className="innerright">
                <div className="head"><h1>Student Registration Form</h1></div>
                <div><h4>Enter the details below</h4></div>
                {error && <div className="error">{error}</div>} 
                <form onSubmit={handleSubmit}>
                    <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                        <FontAwesomeIcon icon={faIdCard} className="icon" />
                        <input type="number" placeholder="Enter StudentId" name="StudentId" value={formdata.StudentId} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                    <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                        <FontAwesomeIcon icon={faUser} className="icon" />
                        <input type="text" placeholder="Enter name" name="name" value={formdata.name} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                    <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                        <FontAwesomeIcon icon={faPhone} className="icon" />
                        <input type="number" placeholder="Enter Phone no." name="Contact" value={formdata.Contact} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                    <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                        <FontAwesomeIcon icon={faBook} className="icon" />
                        <input type="text" placeholder="Enter course" name="Course" value={formdata.Course} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                    <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                        <FontAwesomeIcon icon={faLock} className="icon" />
                        <input type="password" placeholder="Enter password" name="Password" value={formdata.Password} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                    <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                        <FontAwesomeIcon icon={faKey} className="icon" />
                        <input type="text" placeholder="Enter your childhood nick name" name="secret" value={formdata.secret} onChange={HandleEvent} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                    <div className={`input-container ${isFocused ? 'focused' : ''}`}>
                        <FontAwesomeIcon icon={faCamera} className="icon" />
                        <input type="file" placeholder="Upload your photo" name="photo" onChange={handleFileChange} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                    <div className="submit-container">
                        <input type='submit' className="submit-button" />
                    </div>
                </form>
                <Link to={'/login'}><a>Already a user</a></Link>
            </div>
        </div>
    )
}

export default SignStud;

