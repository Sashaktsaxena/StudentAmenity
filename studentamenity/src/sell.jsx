// import React, { useState } from 'react';
// import axios from 'axios';
// import jwt from 'jsonwebtoken';

// function SellItem() {
//     const [itemData, setItemData] = useState({
//         name: '',
//         description: '',
//     });

//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setItemData({ ...itemData, [name]: value });
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error('No token found');
//             }

//             const decodedToken = jwt.decode(token);
//             if (!decodedToken || !decodedToken.userId) {
//                 throw new Error('Invalid token');
//             }

//             const sellerId = decodedToken.userId;
//             const response = await axios.post('http://localhost:3002/sell', { ...itemData, sellerId }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             console.log('Item sold successfully:', response.data);
//             // Handle successful sell (e.g., redirect to the buying page)
//         } catch (error) {
//             console.error('Error selling item:', error);
//         }
//     };

//     return (
//         <div>
//             <h2>Sell an Item</h2>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" name="name" placeholder="Item Name" value={itemData.name} onChange={handleChange} required />
//                 <textarea name="description" placeholder="Item Description" value={itemData.description} onChange={handleChange} required></textarea>
//                 <button type="submit">Sell Item</button>
//             </form>
//         </div>
//     );
// }

// export default SellItem;






//currenlly in use
// import React, { useState,Link } from 'react';
// import axios from 'axios';

// function SellItem() {
//     const [itemData, setItemData] = useState({
//         name: '',
//         description: '',
//     });

//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setItemData({ ...itemData, [name]: value });
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error('No token found');
//             }

//             const response = await axios.post('http://localhost:3002/sell', itemData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             window.location.href = 'http://localhost:3000/sell'
//             console.log('Item sold successfully:', response.data);
//             // Handle successful sell (e.g., redirect to the buying page)
//         } catch (error) {
//             console.error('Error selling item:', error);
//         }
//     };

//     return (
//         <div>
//             <h2>Sell an Item</h2>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" name="name" placeholder="Item Name" value={itemData.name} onChange={handleChange} required />
//                 <textarea name="description" placeholder="Item Description" value={itemData.description} onChange={handleChange} required></textarea>
//                 <button type="submit">Sell Item</button>
//             </form>
            
//         </div>
//     );
// }

// export default SellItem;




import React, { useState } from 'react';
import axios from 'axios';

function SellItem() {
    const [itemData, setItemData] = useState({
        name: '',
        description: '',
        price: '',
        photo: null
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setItemData({ ...itemData, [name]: value });
    };

    const handleFileChange = (event) => {
        setItemData({ ...itemData, photo: event.target.files[0] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', itemData.name);
        formData.append('description', itemData.description);
        formData.append('price', itemData.price);
        formData.append('photo', itemData.photo);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.post('http://localhost:3002/sell', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            window.location.href = 'http://localhost:3000/sell';
            console.log('Item sold successfully:', response.data);
        } catch (error) {
            console.error('Error selling item:', error);
        }
    };

    return (
        <div>
            <h2>Sell an Item</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Item Name" value={itemData.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Item Description" value={itemData.description} onChange={handleChange} required></textarea>
                <input type="number" name="price" placeholder="Price" value={itemData.price} onChange={handleChange} required />
                <input type="file" name="photo" onChange={handleFileChange} required />
                <button type="submit">Sell Item</button>
            </form>
        </div>
    );
}

export default SellItem;
