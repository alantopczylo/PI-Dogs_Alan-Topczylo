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
    const apiKey = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`);
    const apiData = await apiKey.data.map(el => {
        return {
            weight: el.weight.imperial,
            height: el.height.imperial,
            id: el.id,
            name: el.name,
            life_span: el.life_span,
            temperament: el.temperament,
            image: el.image.url, 
        };   
    });
    return apiData;
};

//traigo la informacion que necesito de la base de datos
const getDogsDB = async() => {
    return await Dog.findAll({
        include: {
            model: Temperament,
            attributes: ['name'],
            through: {
                attributes: [],
            }
        }
    });
};

//concateno la api con la db
const getDogsDBAPI = async() => {
    const apiData = await getDogsAPI();
    const dbInfo = await getDogsDB();
    const allData = apiData.concat(dbInfo);
  
    return allData;
};


//routers
router.get('/dogs', async(req,res) => {
    const {name} = req.query;
    const allDogsName = await getDogsDBAPI();

    if(name){
        let dogsName = await allDogsName.filter(el => el.name.toLowerCase().includes(name.toLowerCase()));

        dogsName.length ?
        res.status(200).send(dogsName) :
        res.status(404).send('Raza no encontrada');
    }else{
        res.status(200).send(allDogsName);
    }
});


router.get('/temperament', async(req,res) => {
    const apiKey = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`);
    const temperaments = apiKey.data.map(el => el.temperament).join().split(',');
    const temperamentsTrim = temperaments.map(el => el.trim());
    
    //guardo la informacion de la api en mi base de datos
    temperamentsTrim.forEach(el => {
        if(el !== ''){
            Temperament.findOrCreate({
                where:{
                    name: el
                }
            });
        }
    });
    
    const allTemperaments = await Temperament.findAll()
    res.send(allTemperaments);
});


router.post('/dog', async(req,res) => {
    const {weight, height, name, life_span, temperament, image, id, createdInDb} = req.body;

    const createDogBreed = await Dog.create({
        weight,
        height,
        name,
        life_span,
        image,
        id,
        createdInDb,
    });

    const temperamentDb = await Temperament.findAll({
        where: {name: temperament}
    })
    
    createDogBreed.addTemperament(temperamentDb);
    res.send('Raza creada con éxito');
});


router.get('/dogs/:id', async(req,res) => {
    const {id} = req.params;
    const allDogsName = await getDogsDBAPI(); 

    if(id){
        const breedID = await allDogsName.filter(el => el.id == id);

        breedID.length ?
        res.status(200).json(breedID) :
        res.status(404).send('Raza no encontrada')
    }
});

module.exports = router;
