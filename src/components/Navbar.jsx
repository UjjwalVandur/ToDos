import React,{useState} from 'react'
import { Link } from 'react-router-dom'


const Navbar = ({ isLoggedIn, onLogout }) => {
  
  return (
    <nav className='flex justify-between bg-slate-700 text-white py-2 z-[1] opacity-[90%] sticky top-0'>
      <div className="logo">
        <span className='font-bold text-xl mx-9 cursor-pointer'>ToDos</span>
      </div>
      <ul className='flex gap-8 mx-9'>
        <li>
          <Link to="/">
        <button className="nav-button cursor-pointer hover:font-bold transition-all">Home</button>
      </Link>
        </li>
        
        {isLoggedIn ? (

          <li>
          <Link to="/">
            <button  onClick={onLogout} className="nav-button cursor-pointer hover:font-bold transition-all">LogOut</button>
          </Link>
        </li>):
        (<Link to="/register">
          <button className="nav-button cursor-pointer hover:font-bold transition-all">LogIn / Register</button>
        </Link>)
        }


      </ul>
    </nav>

  )
}

export default Navbar
