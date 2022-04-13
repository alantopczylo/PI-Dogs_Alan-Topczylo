import axios from 'axios';
import { ActionTypes } from './action-types'; //importo las actiontypes

//accion para traerme a las razas
export function getDogs(){
    return async function(dispatch){
        //hago el lamado al back donde estan las razas
        let response = await axios.get('http://localhost:3001/dogs',{
        });

        //despacho la accion
        return dispatch ({
            type: ActionTypes.GET_DOGS,
            payload: response.data
        });
    };  
};


//me traigo los temperamentos
export function getTemperaments(){
    return async function (dispatch) {
        let response = await axios.get('http://localhost:3001/temperament');

        return dispatch({
            type: ActionTypes.GET_TEMPERAMENTS,
            payload: response.data   
        })
    }
}

//action para filtrar los perros por temperamento
export function filterDogsByTemperament(payload){
    return{
        type: ActionTypes.FILTER_BY_TEMPERAMENT,
        payload
    }
}

//action para filtrar los perros por source API - CREATED - ALL
export function filterDogsBySource(payload){
    return{
        type: ActionTypes.FILTER_BY_SOURCE,
        payload
    }
}

//action para irdebar los perros alfabeticamente
export function orderByName(payload){
    return{
        type: ActionTypes.ORDER_BY_NAME,
        payload
    }
}

//action para ordemar los perros por peso
export function orderByWeight(payload){
    return{
        type: ActionTypes.ORDER_BY_WEIGHT,
        payload
    }
}

//action para busqueda por nombre
// export function getNamesOnSearch(name){
//     return async function(dispatch){
//         try{
//             let response = await axios.get("http://localhost:3001/dogs?name=" + name) //pegale a la ruta por query y pasale lo que llegue por payload (name)
    
//             return dispatch({ //despacho la accion
//                 type: ActionTypes.GET_NAMES_ON_SEARCH,
//                 payload: response.data //es lo que devuelve la ruta localhost... una vez que le paso name
//             })  
//         }catch(err){
//             console.log(err)
//         }
               
//     }
// }

export function getNamesOnSearch(name){
    return (dispatch) => {
        return axios.get("http://localhost:3001/dogs?name=" + name)
        .then((response) => {
            dispatch({type: ActionTypes.GET_NAMES_ON_SEARCH, payload: response.data})
        })
        
        .catch(error => {
            if(error.response?.status){
                if(error.response.status === 400){
                    return dispatch({type: ActionTypes.GET_NAMES_ON_SEARCH, payload: [{name: "Can't found dog"}]})
                }
            }
        })
    }
}

export function postDog(payload){
    return async function(dispatch){
        let response = await axios.post('http://localhost:3001/dog/', payload);
    
        return dispatch({
            type:ActionTypes.POST_DOG,
            payload: response.data
        })
    }
}

// Order by weight
export function getDetail (id) { //le paso el id
    return async function (dispatch) {
        try {
            let response = await axios.get("http://localhost:3001/dogs/" + id); //le concateno el id a la ruta
            return dispatch({
                type: ActionTypes.GET_DETAIL,
                payload: response.data
            })
        } catch (err) {
            console.log(err)
        }
    }
}