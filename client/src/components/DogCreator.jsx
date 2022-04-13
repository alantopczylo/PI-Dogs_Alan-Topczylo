import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTemperaments, postDog } from "../actions";
import { Link } from "react-router-dom";
import style from "../styles/DogCreator.module.css"
import NavBar from "./NavBar";
import styles from "../styles/Home.module.css"

//validacion de personaje
function validateForm(form){
    let validateimage = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;
    let validateName = /^[a-zA-Z]+$/g;

    let error = {}; //creo un objeto de error                            
    if (!form.name) {                           
        error.name = "Name is required";        
    } else if(!validateName.test(form.name)){
        error.name = "Name must be only letters"
    } else if (!form.min_height) {
        error.min_height = "Min height is required";
    } else if (form.min_height <= 0) {
        error.min_height = "Min height should be greater than zero";
    } else if (!form.max_height) {
        error.max_height = "Max height is required";
    } else if (form.max_height <= 0) {
        error.max_height = "Max height should be greater than zero";
    } else if (parseInt(form.min_height) >= parseInt(form.max_height)) {      
        error.max_height = "Max height must be greater than Min height";
    } else if (!form.min_weight) {
        error.min_weight = "Min weight is required";
    } else if (form.min_weight <= 0) {
        error.min_weight = "Min weight should be greater than zero";
    } else if (!form.max_weight) {
        error.max_weight = "Max weight is required";
    } else if (form.max_weight <= 0) {
        error.max_weight = "Max weight should be greater than zero";
    } else if (parseInt(form.min_weight) >= parseInt(form.max_weight)) {      
        error.max_weight = "Max weight must be greater than Min weight";
    }  else if (!form.life_span) {
        error.life_span = "Life span is required";
    } else if (form.life_span <= 0) {
        error.life_span  = "Life span should be greater than zero";
    } else if (form.life_span > 20) {
        error.life_span  = "Life span should be smaller than 20";
    } else if (!form.image) {
        error.image = "Please insert an image URL";
    } else if (!validateimage.test(form.image)) {
        error.image = "Please insert a valid image URL";
    }
    return error;
}

export default function DogCreator(){
    const dispatch = useDispatch() //hook dispatch para despachar la accion
    const history = useHistory()
    const temperaments = useSelector(state => state.temperaments); //hook useSelector para traerme el estado del store
    const [error, setError] = useState({}) //hook useState para usar el estado de error, el cual es un objeto vacio

    const [form, setForm] = useState({ //hook usestate para usar los diferentes estados
        name: "",
        min_height: "",
        max_height: "",
        min_weight: "",
        max_weight: "",
        life_span: "",
        image: "",
        temperaments: []
    })

    useEffect(() => { //hook useEffect para renderizar todo el tiempo
        dispatch(getTemperaments())
    }, [dispatch]);

    const handleChange = (e) =>{
        e.preventDefault()
        setForm({
            ...form,
            [e.target.name] : e.target.value //guardo lo que el usuario escriba en el input en mi estado form
        })

        setError(validateForm({ //seteo el estado errores pasandole la funcion validadora
            ...form,
            [e.target.name] : e.target.value
        }));
    }

    const handleSelect = (e) =>{
        setForm({
            ...form,
            temperaments: [...form.temperaments, e.target.value] //agrego en un arreglo todo lo que vaya seleccionando
        })
    }

    const handleSubmit = (e) =>{ //si el error no es diferente de undefined o el campo esta vacio
        if( error.name !== undefined || form.name === "" ||
            error.min_height !== undefined || form.min_height === "" ||
            error.max_height !== undefined || form.max_height === "" ||
            error.min_weight !==undefined || form.min_weight === "" ||
            error.max_weight !== undefined || form.max_weight === "" ||
            error.life_span !== undefined || form.life_span === "" ||
            error.image !== undefined
        ){  
            e.preventDefault()
            document.getElementById("dontSubmit");
            return alert('Complete toda la data') //muestro un alerta
        }

        const addDog = {
            name: form.name,
            height: form.min_height + " - " + form.max_height,
            weight: form.min_weight + " - " + form.max_weight,
            life_span: form.life_span,
            image: form.image,
            temperaments: form.temperaments
        }

        e.preventDefault();
        dispatch(postDog(addDog)); //depacho mi accion de addDog
        alert("Raza creada");
        setForm({
            name: " ",
            min_height: "",
            max_height: "",
            min_weight: "",
            max_weight: "",
            life_span: "",
            image: "",
            temperaments: []
        })
        history.push('/home') //me redirije a la ruta que yo elija
    }

    const handleDelete = (el) => { //creo la funcion para eliminar el temperamento
        setForm({ 
            ...form,
            temperaments: form.temperaments.filter(t => t !== el) //de mi estado me quedo con los temperamentos que sean diferentes al elemento
        })
    }

    return(
        <div className={styles.container}>
            <NavBar />
            <Link to='/home' className={style.goBack}>Go Back</Link>
            <h1 className={style.createTitle}>Create your own breed!</h1>

            <div className={style.formBContainer}>
                <form id="dontSubmit" className={style.formCont} onSubmit={(e) => handleSubmit(e)}>
                    <div className={style.minContFlex}>
                        <label className={style.inputTitle}>Name</label>
                        <input
                            className={style.inputs}
                            autoComplete="off" 
                            type="text" 
                            value={form.name} 
                            name="name" 
                            placeholder="Breed"
                            onChange={(e) => handleChange(e)}
                        />
                        {error.name && (
                            <p className={style.error}>{error.name}</p>
                        )}
                    </div>

                    <div className={style.minContFlex}>
                        <label className={style.inputTitle}>Min Height</label>
                        <input
                            className={style.inputs}
                            type="number" 
                            value={form.min_height} 
                            name="min_height"
                            placeholder="Cm"
                            onChange={(e) => handleChange(e)}
                        />
                        {error.min_height && (
                            <p className={style.error}>{error.min_height}</p>
                        )}
                        <label className={style.inputTitle}>Max Height</label>
                        <input
                            className={style.inputs}
                            type="number" 
                            value={form.max_height} 
                            name="max_height"
                            placeholder="Cm"
                            onChange={(e) => handleChange(e)}
                        />
                        {error.max_height && (
                            <p className={style.error}>{error.max_height}</p>
                        )}
                    </div>

                    <div className={style.minContFlex}>
                        <label className={style.inputTitle}>Min Weight</label>
                        <input
                            className={style.inputs}
                            type="number" 
                            value={form.min_weight} 
                            name="min_weight"
                            placeholder="Kg"
                            onChange={(e) => handleChange(e)}
                        />
                        {error.min_weight&& (
                            <p className={style.error}>{error.min_weight}</p>
                        )}

                        <label className={style.inputTitle}>Max Weight</label>
                        <input
                            className={style.inputs}
                            type="number" 
                            value={form.max_weight} 
                            name="max_weight"
                            placeholder="Kg"
                            onChange={(e) => handleChange(e)}
                        />
                        {error.max_weight && (
                            <p className={style.error}>{error.max_weight}</p>
                        )}
                    </div>

                    <div className={style.minContFlex}>
                        <label className={style.inputTitle}>Life Span</label>
                        <input
                            className={style.inputs}
                            type="number" 
                            value={form.life_span} 
                            name="life_span"
                            placeholder="Years"
                            onChange={(e) => handleChange(e)}
                        />
                        {error.life_span && (
                            <p className={style.error}>{error.life_span}</p>
                        )}
                    </div>

                    <div className={style.minContFlex}>
                        <label className={style.inputTitle}>Image</label>
                        <input
                            className={style.inputs}
                            type="text" 
                            value={form.image} 
                            name="image"
                            placeholder="URL Image"
                            onChange={(e) => handleChange(e)}
                        />
                        {error.image && (
                            <p className={style.error}>{error.image}</p>
                        )}
                    </div>

                    <div className={style.minContFlex}>
                        <label className={style.inputTitle}>Temperaments</label>
                        <select onChange={(e) => handleSelect(e)} className={style.temperaments}>
                            <option disabled value>Temperaments</option>
                            {temperaments.map((d, id) => ( //mapeo los diferentes temperamentos
                                <option value={d.name} key={id}>{d.name}</option>
                            ))}
                            
                        </select>
                        
                        <button type="submit" className={`${styles.selects} ${style.createB}`}>Crear Raza</button>
            
                    </div>
                </form>
                
            </div>
            
            
            {/* renderizo los temperamentos y hago que puedan eliminarlos */}
            {form.temperaments.map(el => 
                <div className={style.temperamtsAdd}>
                    <div className={style.temperamentFlex}>
                        <h2 className={style.elTemp}>{el}</h2>
                        <button onClick={() => handleDelete(el)} className={style.buttonS}>X</button>
                    </div>
                    
                </div>
            )}
        </div>
    )
}