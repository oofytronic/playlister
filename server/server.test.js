const dotenv = require('dotenv');

dotenv.config();

console.log('CLIENT_ID:', process.env.CLIENT_ID);
console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET);
console.log('REDIRECT_URI:', process.env.REDIRECT_URI);



// import { jest } from '@jest/globals';
// import http from 'http';
// import express from 'express';
// import cookieParser from 'cookie-parser';
// import 'dotenv/config';
// import fetch from 'node-fetch';

// const client_id = 'e65e3c5df0184e0f9d104b88da16b5fd';
// const client_secret = process.env.CLIENT_SECRET;
// const redirect_uri = 'http://localhost:8888/callback';

// const app = express();
// app.use(cookieParser());

// function generateRandomString(length) {
//   let text = '';
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (let i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// }

// const stateKey = 'spotify_auth_state';

// app.get('/login', (req, res) => {
//   const state = generateRandomString(16);
//   res.cookie(stateKey, state);

//   const scope = 'ugc-image-upload playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-library-modify user-library-read user-read-email user-read-private';
//   const queryParams = new URLSearchParams({
//     response_type: 'code',
//     client_id: client_id,
//     scope: scope,
//     redirect_uri: redirect_uri,
//     state: state
//   });

//   res.redirect(`https://accounts.spotify.com/authorize?${queryParams.toString()}`);
// });

// let server;

// beforeAll((done) => {
//   server = app.listen(8888, done);
// });

// afterAll((done) => {
//   server.close(done);
// });

// describe('Test the Spotify Auth Server', () => {
//   it('should redirect to Spotify login', (done) => {
//     http.get('http://localhost:8888/login', (res) => {
//       expect(res.statusCode).toBe(302);
//       expect(res.headers.location).toContain('https://accounts.spotify.com/authorize');
//       done();
//     });
//   });
// });