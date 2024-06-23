// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function BuyItems() {
//     const [items, setItems] = useState([]);

//     useEffect(() => {
//         const fetchItems = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3002/items');
//                 setItems(response.data);
//             } catch (error) {
//                 console.error("Error fetching items:", error);
//             }
//         };

//         fetchItems();
//     }, []);

//     const handleBuy = async (itemId) => {
//         const token = localStorage.getItem('token');
//         try {
//             const response = await axios.post(`http://localhost:3002/buy/${itemId}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             console.log("Item bought:", response.data);
//         } catch (error) {
//             console.error("Error buying item:", error);
//         }
//     };

//     return (
//         <div className="items-container">
//             <h1>Items for Sale</h1>
//             {items.length > 0 ? (
//                 items.map(item => (
//                     <div key={item.item_id} className="item">
//                         <h2>{item.name}</h2>
//                         <p>{item.description}</p>
//                         <p>Seller ID: {item.seller_id}</p>
//                         <p>Contact: {item.contact}</p>
//                         <button onClick={() => handleBuy(item.item_id)}>Buy</button>
//                     </div>
//                 ))
//             ) : (
//                 <p>No items available</p>
//             )}
//         </div>
//     );
// }

// export default BuyItems;


//currenly in use
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// function BuyItems() {
//     const [items, setItems] = useState([]);

//     useEffect(() => {
//         const fetchItems = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get('http://localhost:3002/items', {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 setItems(response.data);
//             } catch (error) {
//                 console.error("Error fetching items:", error);
//             }
//         };

//         fetchItems();
//     }, []);

//     const handleRequest = async (itemId) => {
//         const token = localStorage.getItem('token');
//         try {
//             const response = await axios.patch(`http://localhost:3002/items/request/${itemId}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
                
//             });
//             window.location.href = 'http://localhost:3000/buy'
//             console.log("Item requested:", response.data);
//         } catch (error) {
//             console.error("Error requesting item:", error);
//         }
//     };

//     return (
//         <div className="items-container">
//             <h1>Items for Sale</h1>
//             {items.length > 0 ? (
//                 items.map(item => (
//                     <div key={item.item_id} className="item">
//                         <h2>{item.name}</h2>
//                         <p>{item.description}</p>
//                         <p>Seller ID: {item.seller_id}</p>
//                         <p>Contact: {item.contact}</p>
//                         <button onClick={() => handleRequest(item.item_id)}>Request</button>
//                     </div>
//                 ))
//             ) : (
//                 <p>No items available</p>
//             )}
//             <Link to={'/cart'}><a>cart</a></Link>
//         </div>
//     );
// }

// export default BuyItems;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function BuyItems() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3002/items', {
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

    const handleRequest = async (itemId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.patch(`http://localhost:3002/items/request/${itemId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            window.location.href = 'http://localhost:3000/buy';
            console.log("Item requested:", response.data);
        } catch (error) {
            console.error("Error requesting item:", error);
        }
    };

    return (
        <div className="items-container">
            <h1>Items for Sale</h1>
            {items.length > 0 ? (
                items.map(item => (
                    <div key={item.item_id} className="item">
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>
                        <p>Price: {item.price}</p>
                        <p>Seller ID: {item.seller_id}</p>
                        <p>Contact: {item.contact}</p>
                        {item.photo &&(<img src={`data:image/jpeg;base64,${item.photo}`} alt={item.name} className="profile-photos"/> )}
                        <button onClick={() => handleRequest(item.item_id)}>Request</button>
                    </div>
                ))
            ) : (
                <p>No items available</p>
            )}
            <Link to={'/cart'}>cart</Link>
        </div>
    );
}

export default BuyItems;
