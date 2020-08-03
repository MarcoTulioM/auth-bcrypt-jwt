require('dotenv').config();
const bcrypt = require('bcrypt');
const connection = require("../database/connection");
const jwt = require('jsonwebtoken');

module.exports = {
    async index (req, res) {    
        const userOnDb = await connection('users')
        .where('name', req.user.name)
        .select("name")
        .first(); 
        
        return res.json( userOnDb );
    },

    async create (req, res) {
        try{
            /* 
            const salt = await bcrypt.genSalt( 10 );
            const hashedPassword = await bcrypt.hash( req.body.password, salt);

            Ao passar o "number of rounds", que é 10, como segundo parametro 
            o "salt" sera adicionado automaticamente pelo metodo "hash()": 
            */
            const hashedPassword = await bcrypt.hash( req.body.password, 10 );
            

            const user = {
                name: req.body.name,
                password: hashedPassword
            };

            await connection("users").insert( user );
            res.status(201).send();
        } catch {
            res.status(500).send();
        }
    },

    async login (req, res){
        // !! Quando o Login é feita pela React no frontend, ele envia o corpa da requisição dentro de um objeto chamado de "data": { data: { name: 'login', password: 'asdad' } }
        const user = req.body;
        const name = user.name;
        console.log(user)
        console.log(name);
        const userOnDb = await connection('users')
            .where("name", name)
            .select("password")
            .first();
        
        if ( userOnDb === undefined ) {
            return res.send('Can\'t find user').status(500);
        }
        if ( await bcrypt.compare( user.password, userOnDb.password ) ) {
            const accessToken = jwt.sign(
                {name: name}, 
                process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s'}
            );
            const refreshToken = jwt.sign(
                {name: name}, 
                process.env.REFRESH_TOKEN_SECRET
            );

        await connection('users')
            .where('name', user.name)
            .update('refreshToken', refreshToken);

            return res.send({ accessToken, refreshToken }); 
        } else {
            return res.send('Not Allowed!');
        }
    }
};