import React from "react";
import {Link} from 'react-router-dom';
import styles from '../styles/LandingPage.module.css'

const LandingPage = () => {
    return(
        <div className={styles.container}>
            <div className={styles.left}>
                <h1 className={styles.title}>Doggiar</h1>
                <div className={styles.buttonFlex}>
                    <Link to ='/home' className={styles.buttonLink}>    
                        <button className={styles.buttons}>Enter</button>    
                    </Link> 
                </div>        
                
            </div>
             
        </div>  
    )
}

export default LandingPage;