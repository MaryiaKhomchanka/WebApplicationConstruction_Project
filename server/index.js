const express = require('express'); //Backend server framework
const cors = require('cors'); //To allow requests from frontend
require('dotenv').config(); //To load environment variables from .env file
const db = require('./db'); //Database

const bcrypt = require('bcryptjs'); //Password hashing
const jwt = require('jsonwebtoken'); //For creating and verifying JWT tokens


const app = express();


let TwitchAccessToken = null;
let TwitchTokenExpiresAt = 0;

async function GetTwitchAccessToken(){
    if(TwitchAccessToken && Date.now() < TwitchTokenExpiresAt){
        return TwitchAccessToken; //Return cached token if still valid
    }

    const Params = new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
    }); //Parameters for the token request

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        body: Params,
    }); //Requesting a new token

    const data = await response.json(); //Converting the response to JSON

    if (!response.ok){
        console.error('Failed to get Twitch token', data);
        throw new Error('Twitch auth failed');
    } 

    TwitchAccessToken = data.access_token; //Storing the new token
    TwitchTokenExpiresAt = Date.now() + (data.expires_in - 60)*1000; //Setting the expiry time a bit earlier than actual expiry to be safe

    return TwitchAccessToken;
}


async function GetCurrentTwitchStream(){
    const token = await GetTwitchAccessToken(); //Getting a valid access token

    const url = `https://api.twitch.tv/helix/streams?user_login=${process.env.TWITCH_CHANNEL_LOGIN}`; //URL to get the stream info

    const response = await fetch(url, {
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${token}`,
        },
    }); //Calling the Twitch API

    const data = await response.json();

    if (!response.ok){
        console.error('Twitch API error:', data);
        throw new Error('Failed to get Twitch status')
    }

    const online = Array.isArray(data.data) && data.data.length > 0; //Checking if the stream is online
    const stream = online ? data.data[0] : null ; 

    return {online, stream};
}


app.use(cors()); //Allowing requests from frontend
app.use(express.json()); //Parsing JSON request bodies

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
    } //Checking if the Authorization header is present and starts with 'Bearer '

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
        } //Checking for missing fields

        const existingUser = db.prepare('SELECT * FROM user WHERE username = ? OR email = ?').get(username, email);

        if (existingUser) {
            return res.status(400).json({error: 'Username or email already exists'});
        } //Checking if the username or email is already taken

        const passwordHash = await bcrypt.hash(password, 10); //Hashing the password

        const result = db.prepare('INSERT INTO user (username, email, passwordHash) VALUES (?, ?, ?)').run(username, email, passwordHash); //Inserting the new user into the database

        const user = {id: result.lastInsertRowid, username, email};
        const token = createToken(user); //Creating a JWT token for the new user

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
        } //User not found

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(400).json({error: 'Invalid credentials'});
        } //Password does not match

        const userSafe = {id: user.id, username: user.username, email: user.email}; //Creating a safe user object without the password hash
        const token = createToken(userSafe);

        res.json({user: userSafe, token}); //Returning the user info and token
    } catch (error) {
        console.error(error); 
        res.status(500).json({error: 'Failed to login'});
    }
});


app.get('/api/twitch/status', async (req, res) => {
  try {
    const { online, stream } = await GetCurrentTwitchStream();

    res.json({
      online,
      streamTitle: stream ? stream.title : null,
    }); //Returning the stream status
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error checking Twitch status' });
  }
});


app.get('/api/stream/current', authMiddleware, async (req, res) => {
  try {
    const { online, stream } = await GetCurrentTwitchStream();
    
    if (!online || !stream) {
     
      const countRow = db
        .prepare('SELECT COUNT(*) AS count FROM stream_watch WHERE userId = ?')
        .get(req.user.id);

      return res.json({
        online: false,
        stream: null,
        watched: false,
        streamsWatched: countRow.count,
      }); 
    }

    const streamId = String(stream.id);

    const watchRow = db
      .prepare('SELECT 1 AS watched FROM stream_watch WHERE userId = ? AND streamId = ?')
      .get(req.user.id, streamId);

    const countRow = db
      .prepare('SELECT COUNT(*) AS count FROM stream_watch WHERE userId = ?')
      .get(req.user.id);

    res.json({
      online: true,
      stream: {
        id: streamId,
        title: stream.title,
        startedAt: stream.started_at,
      },
      watched: !!watchRow,
      streamsWatched: countRow.count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error loading current stream for user' });
  }
});



app.post('/api/stream/watched', authMiddleware, async (req, res) => {
  try {
    const {online, stream} = await GetCurrentTwitchStream();

    if (!online || !stream) {
      return res.status(400).json({ error: 'No live stream to mark as watched' }); //No live stream
    }

    const streamId = String(stream.id);

   
    db.prepare(
      'INSERT OR IGNORE INTO stream_watch (userId, streamId) VALUES (?, ?)'
    ).run(req.user.id, streamId);

    const countRow = db
      .prepare('SELECT COUNT(*) AS count FROM stream_watch WHERE userId = ?')
      .get(req.user.id);

    res.json({
      watched: true,
      streamsWatched: countRow.count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error marking stream as watched' });
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


app.get('/api/me', authMiddleware, (req, res) => {
  const user = db
    .prepare('SELECT id, username, email, avatarUrl, createdAt FROM user WHERE id = ?')
    .get(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const countRow = db
    .prepare('SELECT COUNT(*) AS count FROM stream_watch WHERE userId = ?')
    .get(req.user.id);

  user.streamsWatched = countRow.count;

  res.json({ user });
});



app.put('/api/me', authMiddleware, (req, res) => {
    const {email, avatarUrl} = req.body;

    if(!email) {
        return res.status(400).json({error: 'Email is required'});
    }

    const existing = db 
        .prepare('SELECT id FROM user WHERE email = ? AND id != ?')
        .get(email, req.user.id);


    if (existing) {
        return res.status(400).json({ error: 'Email already in use' });
    }

     db.prepare('UPDATE user SET email = ?, avatarUrl = ? WHERE id = ?')
        .run(email, avatarUrl || null, req.user.id);

    const updatedUser = db
        .prepare('SELECT id, username, email, avatarUrl, createdAt FROM user WHERE id = ?')
        .get(req.user.id);

    res.json({ user: updatedUser });
});



app.put('/api/me/password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both passwords are required' });
  }

  const user = db
    .prepare('SELECT id, passwordHash FROM user WHERE id = ?')
    .get(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  db.prepare('UPDATE user SET passwordHash = ? WHERE id = ?')
    .run(newHash, req.user.id);

  res.json({ message: 'Password updated successfully' });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Server running on http://localhost:' + PORT);
 });




