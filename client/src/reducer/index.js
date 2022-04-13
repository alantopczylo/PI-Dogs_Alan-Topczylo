import { ActionTypes } from "../actions/action-types";

//seteo mi estado inicial
const initialState = {
  dogs: [],
  temperaments: [],
  allDogsName: [],
  detail: [],
  sortedWeight: [],
  sorted: [],
};

//seteo mi reducer con el estado inicial y la accion
function dogsReducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.GET_DOGS:
      return {
        //devuelvo
        ...state, //mi estado anterior
        dogs: action.payload, //y en dogs: [] guardo lo que devuelva la accion de getdogs
        allDogsName: action.payload, //tambien guardo la accion en allDogsName para utilizar en los filtros
      };

    case ActionTypes.GET_TEMPERAMENTS:
      return {
        ...state,
        temperaments: action.payload,
      };

    case ActionTypes.GET_NAMES_ON_SEARCH:
        console.log(state.dogs)
      return {
        ...state,
        dogs: action.payload,
      };

    case ActionTypes.POST_DOG:
      return {
        ...state,
      };

    case ActionTypes.FILTER_BY_TEMPERAMENT:
      const allDogsName = state.allDogsName; //me traigo todos los perros del estado
      let filteredDogs = []; //defino un array vacio de los perros que van a ser filtrados

      if (action.payload === "all") {
        //si mi action.payload(e.target.value) === 'all'
        filteredDogs = allDogsName; //devuelvo todos los perros
      } else {
        for (let i = 0; i < allDogsName.length; i++) {
          //recorro todos los perros
          //guardo en matched aquel perro/s cuyo temperamento haya sido encontrado en el payload que le llega
          let matched = allDogsName[i].temperaments?.find(
            (el) => el.name === action.payload
          );

          if (matched) {
            //si encontro un perro/s con ese temperamento
            filteredDogs.push(allDogsName[i]); //le pusheo al array ese perro/s
          }
        }
      }

      return {
        ...state,
        dogs: filteredDogs,
      };

    case ActionTypes.FILTER_BY_SOURCE:
      const allDogsSource = state.allDogsName; //me traigo todos los perros del estado
      //si el payload que me llega es createdInDb, devuelvo los perros creados en BDD.. sino, filtro todos los perros y devuelvo aquellos que no hayan sido creados en la bdd
      const filterBySource =
        action.payload === "createdInDb"
          ? allDogsSource.filter((el) => el.createdInDb)
          : allDogsSource.filter((el) => !el.createdInDb);

      return {
        ...state,
        dogs: action.payload === "all" ? state.allDogsName : filterBySource,
      };

    case ActionTypes.ORDER_BY_NAME:
      let sorted =
        action.payload === "asc" //si el action payload es asc
          ? state.dogs.sort(function (a, b) {
              //accede a mi estado de dogs y hacele un sort. el cual compara los nombres y los ordena
              if (a.name > b.name) return 1; //ordena de menor a mayor
              if (b.name > a.name) return -1;
              return 0; //no ordena
            })
          : state.dogs.sort(function (a, b) {
              if (a.name > b.name) return -1; //ordena de mayor a menor
              if (b.name > a.name) return 1;
              return 0; //no ordena
            });
      return {
        ...state,
        dogs: sorted,
      };

    case ActionTypes.ORDER_BY_WEIGHT:
        let doggy = [...state.dogs];
        if(action.payload === "weight1") {
          doggy.sort((a, b) => {
            if(a.weight.includes('NaN')){ a.weight = '1' }
            if(b.weight.includes('NaN')){ b.weight = '1' }
                return parseInt(a.weight) - parseInt(b.weight);
            });
        } 
        if(action.payload === "weight2") {
          doggy.sort((a, b) => {
            if(a.weight.includes('NaN')) { a.weight = '1' }
            if (b.weight.includes('NaN')){ b.weight = '1' }
                return parseInt(b.weight) - parseInt(a.weight);
            });
      }
      return {
        ...state,
        dogs: doggy,
      };

    // Order by weight
    case ActionTypes.GET_DETAIL:
      return {
        ...state,
        detail: action.payload,
      };

    default:
      return state;
  }
}

export default dogsReducer;
