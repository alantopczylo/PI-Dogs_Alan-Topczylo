import React from "react";
import { Link } from "react-router-dom";
import style from '../styles/Home.module.css'

// const handleRefresh = (e) => {
//     window.location.reload(false)
// }


export default function NavBar(){
    return(
        <div className={style.header}>
        {/* logo */}
        <Link to='/home'>
            <h1 className={style.logo}>Doggiar</h1>
        </Link>
        
        {/* creador de raza */}
        <Link to='/dog' className={style.breedCreator}>Create</Link>
    </div>
    )
   
}