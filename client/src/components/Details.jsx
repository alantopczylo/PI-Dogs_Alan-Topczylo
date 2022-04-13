import React from 'react'
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getDetail } from '../actions';
import style from '../styles/Details.module.css'
import styles from '../styles/Home.module.css'
import cardStyle from '../styles/Card.module.css'
import NavBar from './NavBar';
import loading from '../assets/loadingdog.gif'

export default function Details(){
    const dispatch = useDispatch(); //hook dispatch para despachar la accion
    let {id} = useParams()

    useEffect(() => { //hook useEffect para que se rendericen los detalles de el id solicitado
        dispatch(getDetail(id))
    },[dispatch, id])

    const dog = useSelector(state => state.detail); //hook para traerme el estado del store

    let fixedTemps = []; //creo un array vacio de los temperamentos
    dog[0]?.temperaments?.forEach(el => fixedTemps.push(el.name)); //por cada temperamento del nombre del perro [0], pusheame el nombre del temperamento al array

    return (
        <div className={styles.container}>
            <Link to='/home'>
                <NavBar />
            </Link>

            {
                dog.length > 0 ?
                <div className={style.detail}>
                    <div className={style.cardDet}>
                        <div>
                            <h1 className={cardStyle.propTitle}>{dog[0].name}</h1>
                        </div>
                        
                        <div>
                            <img src={dog[0].image} alt="" className={style.cardImage}/>
                        </div>
                        
                        

                        <div className={`${cardStyle.propInfo} ${style.tempFlex}`}>
                            <h2 className={cardStyle.propTitle}>Temperaments: &nbsp;</h2>
                            
                            {fixedTemps.map(el=>
                                <div> {el}, &nbsp;</div>   
                            )}
                        </div>

                        <div className={style.tempGlobal}>
                            <div className={style.tempFlex}>
                                <h2 className={cardStyle.propTitle}>Height: </h2>
                                <p className={cardStyle.propInfo}>{dog[0].height} cm</p>
                            </div>
                            
                            <div className={style.tempFlex}>
                                <h2 className={cardStyle.propTitle}>Weight: </h2>
                                <p className={cardStyle.propInfo}>{dog[0].weight} KG</p>
                            </div>
                            
                            <div className={style.tempFlex}>
                                <h2 className={cardStyle.propTitle}>Lifespan: </h2>
                                <p className={cardStyle.propInfo}>{dog[0].life_span}</p>
                            </div>
                            
                        </div>
                        
                        
                        <div>
                            <Link to='/home' className={style.goBack}>Go back</Link>
                        </div> 
                    </div> 

                     
                </div> 
                :
                <div className={style.loadingCont}>
                    <img src={loading} alt="" />
                </div>
                
            }
            
        </div>
    )
}