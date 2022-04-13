import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getNamesOnSearch, getDogs} from "../actions/index"
import style from '../styles/Home.module.css'
import Card from "./Card";

export default function SearchBar(){
    const dispatch = useDispatch(); //hook para despachar la accion
    const [name, setName] = useState(""); //setname va a ser lo que tipee el usuario, siendo el estado inicial ""
    
    // function handleInputChange(e){
    //     e.preventDefault();
    //     setName(e.target.value); //el value del input va a ser lo que ingrese el usuario en la busqueda
    // }

    // function handleSubmit(e){ 
    //     e.preventDefault();
    //     dispatch(getNamesOnSearch(name)); //despacho la accion cuando el usuario aprieta el boton, siendo name el payload
    //     setName("")   
    // }

    const busqueda = (arg) => {
        arg === ""
          ? dispatch(getDogs())
          : //else
            dispatch(getNamesOnSearch(arg));
        
      };

    const handleInputChange =  (e) =>{
        e.preventDefault()
        busqueda(e.target.value) 
        setName(e.target.value)
        
    }

    return(
        <div>
            <input type="text" value={name} placeholder="Breed" onChange={(e) => handleInputChange(e)} className={`${style.searchButton} ${style.selects}`}/>
            <button type="submit" className={`${style.selects} ${style.search}`}>Search</button>
        </div>
    )
}