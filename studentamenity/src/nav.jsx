import { useRef, useState } from "react";
import {FaBars, FaTimes} from "react-icons"


import { BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';



function Navbar() {
	// const [iscartOpen,setCartopen]=useState(false);
	// function openCart(){
	// 	setCartopen(true);
	//   };
	//   function closecart(){
	// 	setCartopen(false);
	//   };
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [Searchbar,setsearchbar]=useState(false);

	const navRef = useRef();

	const showNavbar = () => {
		navRef.current.classList.toggle(
			"responsive_nav"
		);
	};
	const toggleSearch = () => {
        setsearchbar(!Searchbar);
    };

	return (
		<div className="navbox">
		<header className="navb">
		  <h3 className="logo">CAMSTORE</h3>
		  
			<nav ref={navRef}>
        
          <a  className="otherel" href="/#">Home</a>
				  
				
				  <a className="otherel" href="/#">About</a>
          <a className="otherel" href="#brand" >Brands</a>
		
          <a className="otherel" onClick={() => setIsCartOpen(true)} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart " viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg></a>
				
				{/* <Cart isOpen={iscartOpen} closecart={closecart} /> */}
				
          <a className="otherel" onClick={()=>setsearchbar(true)}>                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg></a>
				
        

          
        
          {/* <a className="otherel" href="/#">                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                  </svg></a> */}
				  <Link to="/login">Login</Link>
         {/* <Registration /> */}
         <Link to="/register">Register</Link>
				
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbar}>
					{/* <FaTimes /> */}
				</button>
				
			</nav>

			<button
				className="nav-btn"
				onClick={showNavbar}>
				{/* <FaBars /> */}
			</button>
		</header>
		</div>
	);
}

export default Navbar;