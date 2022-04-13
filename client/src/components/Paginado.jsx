import React from "react";
import style from "../styles/Paginado.module.css"
import styles from "../styles/Home.module.css"

export default function Paginado({dogsPerPage, allDogs, paginado}){
    const pageNumbers = []; //defino un array vacio
    const handleRefresh = (e) => {
        window.location.reload(false)
    }

    for(let i = 1 ; i <= Math.ceil(allDogs/dogsPerPage); i++){ //divido todos los perros por los que quiero por pagina
        pageNumbers.push(i); //pusheo al array ese numero
    }

    return(
        <div className={style.paginado}>
            <ul className={style.ulFlex}>
                {
                    pageNumbers &&
                    pageNumbers.map(n => ( //mapeo el arreglo y muestro los numeros de pagina
                        <li key={n} className={style.listStyle}>
                            <button onClick={() => paginado(n)} className={style.buttonPag}>{n}</button>
                        </li>   
                    ))
                    
                }
                <button className={`${styles.selects} ${styles.search}`} onClick={() => handleRefresh()}>Refresh</button>
            </ul>

            
        </div>
    )
}