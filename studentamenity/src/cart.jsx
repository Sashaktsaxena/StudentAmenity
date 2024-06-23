// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function CartPage() {
//     const [items, setItems] = useState([]);

//     useEffect(() => {
//         const fetchItems = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get('http://localhost:3002/cart', {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 setItems(response.data);
//             } catch (error) {
//                 console.error("Error fetching cart items:", error);
//             }
//         };

//         fetchItems();
//     }, []);

//     return (
//         <div className="cart-container">
//             <h1>Your Cart</h1>
//             {items.length > 0 ? (
//                 items.map(item => (
//                     <div key={item.item_id} className="item">
//                         <h2>{item.name}</h2>
//                         <p>{item.description}</p>
//                         <p>Item buyed in :{item.price}</p>
//                         <p>Seller Contact: {item.seller_contact}</p>
//                         <p>Item Status :{item.status}</p>
//                         {item.photo &&(<img src={`data:image/jpeg;base64,${item.photo}`} alt={item.name} className="profile-photos"/> )}
//                     </div>
//                 ))
//             ) : (
//                 <p>No items in cart</p>
//             )}
//         </div>
//     );
// }

// export default CartPage;


import React, { useState, useEffect } from "react";
import axios from "axios";

function CartPage() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3002/cart', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            {items.length > 0 ? (
                items.map(item => (
                    <div key={item.item_id} className="item">
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>
                        <p>Price: {item.price}</p>
                        <p>Seller Contact: {item.seller_contact}</p>
                        <p>Status: {item.status}</p>
                        {item.photo && (
                            <img
                                src={`data:image/jpeg;base64,${item.photo}`}
                                alt={item.name}
                                className="profile-photos"
                            />
                        )}
                    </div>
                ))
            ) : (
                <p>No items in cart</p>
            )}
        </div>
    );
}

export default CartPage;
