require ('dotenv').config();
const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require('axios');
const {YOUR_API_KEY} = process.env;
const {Dog, Temperament} = require('../db');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

//traigo la informacion que necesito de la api
const getDogsAPI = async() => {
    const apiKey = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`); //guardo la informacion de la api
    const apiData = await apiKey.data.map(el => { //mapeo la informacion que me traje
        const temperaments = el.temperament?.toString().split(",") //divido los temperamentos por coma
        const fixedTemps = []; //creo un nuevo array
        temperaments?.forEach(el => { //cada temperamento lo paso al array en forma de objeto
            fixedTemps.push({"name" : el.trim()})
        });

        return { //retorno la informacion que quiero
            weight: el.weight.metric,
            height: el.height.metric,
            id: el.id,
            name: el.name,
            life_span: el.life_span,
            temperaments: fixedTemps,
            image: el.image.url,
            // api: true
        };   
    });
    return apiData; //retorno toda la data
};

//traigo la informacion que necesito de la base de datos
const getDogsDB = async() => {
    return await Dog.findAll({ //leo toda la tabla de perros con findAll
        include: { //incluyo el modelo de temperament
            model: Temperament,
            attributes: ["name"], //selecciono el atributo name de Temperament
            through: { //mediante los atributos
                attributes: [],
            }
        }
    });
};

//concateno la api con la base de datos. Almaceno toda la informacion
const getDogsDBAPI = async() => {
    const apiData = await getDogsAPI(); //Almaceno la informacion de la api
    const dbInfo = await getDogsDB(); //Almaceno la informacion de la base de datos
    const allData = apiData.concat(dbInfo); //Concateno la api con la base de datos
  
    return allData; //Retorno toda la informacion concatenada
};


//INICIO RUTAS

//Ruta get de perros
router.get('/dogs', async(req,res,next) => { //llamo a la ruta /dogs
    try{ //intenta..
        const {name} = req.query; //name va a ser el nombre que escriba en la url
        const allDogsName = await getDogsDBAPI(); //me traigo todos los perros 
    
        if(name){
            let dogsName = await allDogsName.filter(el => el.name.toLowerCase().includes(name.toLowerCase())); //filtro los nombres pasados por query, y los paso a lower case
    
            dogsName.length ? //si encontro algo..
            res.status(200).send(dogsName) : //envio el perro encontrado
            res.status(400).send('Raza no encontrada'); //si no esta, arroja error
        }else{
            res.status(200).send(allDogsName); //si no pasan nada por query, envio todos los perros
        }
    }catch(err){//mando un error si se produce una excepcion
        next(err)
    }   
});

//Ruta get de perros por ID
router.get('/dogs/:id', async(req,res,next) => {
    try{ //intenta..
        const {id} = req.params; //tomo el id pasado por parametro
        const allDogsName = await getDogsDBAPI(); //me traigo todos los perros
    
        const breedID = await allDogsName.filter(el => el.id == id); //filtro todos los perros y almaceno el elemento cuyo id sea igual al id
    
        breedID.length ? //si encontro ese id..
        res.status(200).json(breedID) : //envio ese perro
        res.status(404).send('Raza no encontrada') //sino envio un error
    }catch(err){
        next(err)
    }
});


//Ruta get de los temperamentos
router.get('/temperament', async(req,res) => {
    const apiKey = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`); //Me traigo la info de la api
    let temperaments = apiKey.data.map(el => el.temperament); //mapeo los temperamentos traidos de la api
    let temps = temperaments.toString().split(","); //los separo por coma
    temps = [...new Set(temps)].sort() //creo un objeto con Set donde guardo los temperamentos, y luego con sort los ordeno
    //guardo la informacion de la api en mi base de datos
    
    temps.forEach(el => { //por cada temperamento, ingresa y hace lo siguiente..
        if(el !== ''){ //si el elemento NO es un string vacio
            let i = el.trim() //le quito un posible espacio al temperamento
            Temperament.findOrCreate({ //ingreso al modelo Temperament y realizo un findOrCreate. Si no encuentra el temperamento en la base de datos lo crea
                where:{ //creo los temperamentos con el nombre = i
                    name: i
                }
            });
        }
    });
    
    const allTemperaments = await Temperament.findAll(); //almaceno todos los temperamentos encontrados en el modelo Temperament
    res.send(allTemperaments); //envio los temperamentos
});


//Ruta post de creacion del perro.
router.post('/dog', async(req,res,next) => {
    try{
        const {weight, height, name, life_span, temperaments, image, id, createdInDb} = req.body; //me traigo la info del body

        const createDogBreed = await Dog.create({ //creo la raza de perro
            weight,
            height,
            name,
            life_span,
            image,
            id,
            createdInDb,
        });
    
        let temperamentDb = await Temperament.findAll({ //dentro del modelo Temperament, encontra y almacena los temperamentos que coincidan con el request body
            where: {name: temperaments}
        });
        
        await createDogBreed.addTemperament(temperamentDb); //a createDogBreed agregale el temperamento almacenado en temperamentDb
        res.send('Raza creada con éxito');
    }catch(err){
        next(err)
    }   
});


module.exports = router;
