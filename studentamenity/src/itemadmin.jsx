// // src/components/ItemManagement.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const ItemManagement = () => {
//   const [itemId, setItemId] = useState('');

//   const handleDeleteItem = async () => {
//     try {
//       await axios.delete(`/api/items/${itemId}`);
//       alert('Item deleted successfully');
//     } catch (error) {
//       console.error('Error deleting item:', error);
//     }
//   };

//   return (
//     <div>
//       <h3>Item Management</h3>
//       <input type="text" value={itemId} onChange={(e) => setItemId(e.target.value)} placeholder="Item ID" />
//       <button onClick={handleDeleteItem}>Delete Item</button>
//     </div>
//   );
// };

// export default ItemManagement;



import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPage() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3002/admin/items', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, []);

    const handleDelete = async (itemId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3002/admin/items/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setItems(items.filter(item => item.item_id !== itemId));
            console.log("Item deleted");
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div className="items-container">
            <h1>Manage Items</h1>
            {items.length > 0 ? (
                items.map(item => (
                    <div key={item.item_id} className="item">
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>
                        <p>Status: {item.status}</p>
                        <button onClick={() => handleDelete(item.item_id)}>Delete</button>
                    </div>
                ))
            ) : (
                <p>No items available</p>
            )}
        </div>
    );
}

export default AdminPage;
