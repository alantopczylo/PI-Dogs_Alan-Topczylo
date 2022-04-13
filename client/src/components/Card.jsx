import React from "react";
import style from "../styles/Card.module.css"

export default function Card({image, name, temperaments, weight, id}){

    let fixedTemps = []
    temperaments?.forEach((el) => fixedTemps.push(el.name))
    
    return(
        <div className={style.cards}>
            <div className={style.card}>
                <h1 className={style.cardName}>{name}</h1>
                <img src={image} alt="imagen no encontrada" className={style.cardImage}/>
                
                <h5 className={style.propTitle}>Temperaments:</h5>
                <p className={style.propInfo}>{fixedTemps?.join(", ")}</p>
                <h5 className={style.propTitle}>Weight</h5>
                <p className={style.propInfo}>{weight} KG</p>

                <a href={`http://localhost:3000/dogs/${id}`}>
                    <button className={style.buttonSee}>See more!</button>  
                </a>
            </div>
        </div> 
    )
    
}