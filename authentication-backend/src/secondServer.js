require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./database/connection');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors());

// !NOTA! !ERRO! A rota abaixo permite criar infinitos Tokens de acesso sem antes verificar a expiração dos tokens ateriores.  
app.post('/refresh_token', (req, res) => {
    const token = req.body.token;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.send(err);

        const includes = await connection('users')
        .select('refreshToken')
        .where('name', user.name)
        .first();
        if (!includes) return res.sendStatus(401);
        if (includes.refreshToken != token) return res.sendStatus(403);

        const newAccessToken = jwt.sign(
            {name: user.name}, 
            process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'}
        );
        await connection('users')
            .where('name', user.name)
            .update('refreshToken', newAccessToken);

        return res.json({ newAccessToken });
    });    
});

app.delete('/logout', async (req, res) => {
    const token = req.body.token;
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.send(err);
        const includes = await connection('users')
        .select('refreshToken')
        .where('name', user.name)
        .first();
        if (includes.refreshToken == null) return res.sendStatus(401);
        if (includes.refreshToken != token) return res.sendStatus(403);

        await connection('users')
            .where('name', user.name)
            .update('refreshToken', null);
        
        return res.sendStatus(204);
    });
});

app.listen(4000);