const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const app = express();

app.use(cors());
app.use(express.json());

function createToken(user) {
    return jwt.sign(
        {
            id: user.id, 
            username: user.username,
            email: user.email
        }, 
        process.env.JWT_SECRET, 
        {expiresIn: '7d'}
    );
}

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'No token provided'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({error: 'Invalid token'});
    }
}


app.post('/api/register', async (req, res)=>{
    try{    
        const {username, email, password} = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({error: 'All fields are required'});
        }

        const existingUser = db.prepare('SELECT * FROM user WHERE username = ? OR email = ?').get(username, email);

        if (existingUser) {
            return res.status(400).json({error: 'Username or email already exists'});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = db.prepare('INSERT INTO user (username, email, passwordHash) VALUES (?, ?, ?)').run(username, email, passwordHash);

        const user = {id: result.lastInsertRowid, username, email};
        const token = createToken(user);

        res.status(201).json({user, token});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to register user'});
    }
});

app.post('/api/login', async (req, res)=>{
    try {
        const{emailOrUsername, password} = req.body;

        if (!emailOrUsername || !password) {
            return res.status(400).json({error: 'All fields are required'});
        }

        const user = db.prepare('SELECT * FROM user WHERE username = ? OR email = ?').get(emailOrUsername, emailOrUsername);

        if (!user) {
            return res.status(400).json({error: 'Invalid credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(400).json({error: 'Invalid credentials'});
        }

        const userSafe = {id: user.id, username: user.username, email: user.email};
        const token = createToken(userSafe);

        res.json({user: userSafe, token});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to login'});
    }
});



app.get('/', (req, res)=>{
    res.json({message: 'Backend is working'});
});

app.get('/api/product', (req, res)=>{
    try {
        const product = db.prepare('SELECT * FROM product').all();
        res.json(product);
    }catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch products'});
    }
});

app.get('/api/schedule', (req, res)=>{
    try {
        const schedule = db.prepare('SELECT * FROM schedule').all();
        res.json(schedule);
    }catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch schedule'});
    }
});



// Get current logged-in user (requires token)
app.get('/api/me', authMiddleware, (req, res) => {
  // req.user comes from the decoded token
  res.json({ user: req.user });
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Server running on http://localhost:' + PORT);
 });




