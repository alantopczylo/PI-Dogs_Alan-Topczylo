import React from "react";
import { useState, useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux'
import { getDogs, getTemperaments, filterDogsByTemperament, filterDogsBySource, orderByName, orderByWeight } from "../actions";
import Card from "./Card";
import Paginado from "./Paginado";
import SelectTemperaments from "./SelectTemperament";
import SearchBar from "./SearchBar";
import style from "../styles/Home.module.css"
import NavBar from "./NavBar";
import loading from "../assets/loadingdog.gif"

//exporto mi componente
export default function Home(){
    const dispatch = useDispatch(); //uso el hook useDispatch para despachar la accion
    const allDogsName = useSelector(state => state.dogs); //uso el hook useSelector para extraer el estado del store
    const allTemperaments = useSelector(state => state.temperaments);

    const INITIAL_PAGE = 1;//seteo la pagina inicial
    const NUMBER_OF_DOGS = 8; //seteo la cantidad de perros por pagina
    const [currentPage, setCurrentPage] = useState(INITIAL_PAGE); //defino un estado con la pagina actual y que me la setee en 1
    const [dogsPerPage, setDogsPerPage] = useState(NUMBER_OF_DOGS); //defino un estado con la cantidad de perros por pagina y que me la setee en 8
    const [order, setOrder] = useState('');
    const [orderW, setOrderW] = useState('');
    
    console.log(allDogsName.length)
    const indexOfLastDog = currentPage * dogsPerPage; //inicial 8
    const indexOfFirstDog = indexOfLastDog - dogsPerPage; //inicial 0
    const currentDogs = allDogsName && allDogsName.slice(indexOfFirstDog, indexOfLastDog); //me traigo todos los personajes y le hago un slice para que se muestren solo 8

    const paginado = pageNumber => {
        setCurrentPage(pageNumber);
    }

    useEffect(() => { //uso el hook useEffect para traerme del estado los perros cuando el componente se monta
        dispatch(getDogs()); //despacho la accion getDogs === mapDispatchToProps
        dispatch(getTemperaments()); //despacho la accion getTemperaments
    },[]);

    
    // function handleClick(e){ //reseteo los perros.
    //     e.preventDefault();
    //     dispatch(getDogs());
    //     setCurrentPage(1)
    // }

    const handleFilterTemperaments = (e) =>{ //declaro una funcion para manejar el filtro de temperamentos
        e.preventDefault()
        dispatch(filterDogsByTemperament(e.target.value)) //despacho la accion con el payload
        setCurrentPage(1)
    }

    const handleFilterDogsBySource = (e) =>{
        e.preventDefault()
        dispatch(filterDogsBySource(e.target.value))
        setCurrentPage(1)
    }

    const handleSortAlphabetical = (e) =>{
        e.preventDefault();
        dispatch(orderByName(e.target.value));
        setCurrentPage(1)
        setOrder(`Ordenado ${e.target.value}`) //seteo el ordenamiento para que renderize
    }

    const handleSortWeight = (e) => {
        e.preventDefault();
        dispatch(orderByWeight(e.target.value));
        setCurrentPage(1);
        setOrderW(`Ordenado ${e.target.value}`) //seteo el ordenamiento para que renderize
    }
 
    //renderizo mi componente
    return(
        <div className={style.container}>
            {/* inicio nav */}
            
            <nav className={style.nav}>
                {/* inicio navbar */}
                <NavBar /> 
                
                {/* inicio filters menu */}
                <div className={style.containerMenu}>
                    <div className={`${style.order} ${style.resetOrder}`}>
                        <h2 className={style.filterTitles}>Order by</h2>

                        <div className={style.flexContainer}>
                            {/* Ordenar por raza alfabeticamente */}
                            <div className={style.package}>
                                <p className={`${style.filterBys} ${style.resetLeft}`}>A-Z</p>
                                <select onChange={e => handleSortAlphabetical(e)} className={style.selects}>
                                    <option disabled selected>-----</option>
                                    <option value="asc">A-Z</option>
                                    <option value="desc">Z-A</option>
                                </select>
                            </div>

                            {/* Ordenar por peso */}
                            <div className={style.package}>
                                <p className={style.filterBys}>Weight</p> 
                                <select onChange={e => handleSortWeight(e)} className={style.selects}>
                                    <option disabled selected>----------</option>
                                    <option value="weight1">Small</option>
                                    <option value="weight2">Big</option>
                                </select>
                            </div>
                        </div>     
                    </div>
                    
                    <div className={style.order}>
                        <h2 className={style.filterTitles}>Filter by</h2>

                        <div className={style.flexContainer}>
                            <div className={style.package}>
                                {/* Filtrar por raza existente o creada */}
                                <p className={`${style.filterBys} ${style.resetLeft}`}>Created By</p>
                                <select onChange={e => handleFilterDogsBySource(e)} className={style.selects}>
                                    <option disabled selected>--------------</option>
                                    <option value="all">All</option>
                                    <option value="createdInDb">Created</option>
                                    <option value="api">API</option>
                                </select>
                            </div>
                            
                            <div className={style.package}>
                                <p className={style.filterBys}>Temperaments</p>
                                {/* Filtrar por temperamento */}
                                <SelectTemperaments 
                                    allTemperaments={allTemperaments}
                                    handleFilterTemperaments={e => handleFilterTemperaments(e)}
                                />
                            </div>    
                        </div>  
                    </div>
                    
                    <div className={style.searchBar}>   
                        <h2 className={style.filterTitles}>Search By</h2>
                        {/* Buscar por raza */}
                        <div className={style.package}>
                            <p className={style.filterBys}>Name</p>
                            <SearchBar />
                        </div>   
                    </div>   
                </div>
            </nav>
            
            <div className={style.paginadoFlex}>
                <Paginado 
                        dogsPerPage={dogsPerPage}
                        allDogs={allDogsName.length} //le paso .length ya que necesito un valor numerico
                        paginado={paginado}
                />
            </div>
            
            <div className={style.cardGrid}>
                {   
                    allDogsName.length > 0 ?

                    currentDogs?.map(el => { //mapeo los perros
                        return(
                            <div>
                                <Card
                                    name={el.name} 
                                    image={el.image}
                                    temperaments={el.temperaments} 
                                    weight={el.weight} 
                                    key={el.id}
                                    id={el.id}
                                />
                            </div>                 
                        )
                    }):
                    
                    <div className={style.loadingGif}>
                        <img src={loading} alt="" />
                    </div>
                    
                }
            </div>         
        </div>
    )
}