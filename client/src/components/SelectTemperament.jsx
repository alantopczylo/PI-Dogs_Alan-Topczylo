import React from "react";
import style from "../styles/Home.module.css"

export default function SelectTemperaments({allTemperaments, handleFilterTemperaments}){
    return (
      <select onChange={handleFilterTemperaments} className={style.selects}>
        <option disabled selected>----------------------------</option>
        <option value="all">All</option>
        {allTemperaments.map(temp => (
          <option key={temp.id} value={temp.name}>{temp.name}</option>
        ))} 
      </select>
    );
    
}