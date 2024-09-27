// import express from 'express';
// import compression from 'compression';
// import { config } from 'dotenv';
// import { readFileSync } from 'fs';

const express = require('express');
const compression = require('compression');
const { config } = require('dotenv');
const { readFileSync } = require('fs');

config();

const app = express();
const port = 9998;

const fetchToken = async ({
  clientId = process.env.CLIENT_ID,
  clientSecret = process.env.CLIENT_SECRET,
  grantType = process.env.GRANT_TYPE,
  accessTokenUrl = process.env.TOKEN_URL,
}) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({
    "client_id": clientId,
    "client_secret": clientSecret,
    "grant_type": grantType
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: body,
    redirect: "follow"
  };

  const res = await fetch(accessTokenUrl, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));

  return {
    access_token: res.access_token,
    token_type: res.token_type,
    expires_in: res.expires_in,
  };
};

app.get('/get-token', async (req, res) => {
  const tokenRes = await fetchToken();
  res
    .cookie('_access_token', `${tokenRes.access_token}`, { httpOnly: false, maxAge: tokenRes.expires_in * 1000 })
    .send('Token has been set in the cookie');
});

app.use(express.static('dist', { index: false }));
app.use(compression());
app.use(express.json());

app.get('/', (req, res) => {
  const html = readFileSync('./dist/index.html', 'utf8');
  res.send(html);
});

app.post('/api/token', async (req, res) => {
  const tokenRes = await fetchToken({
    clientId: req.body.clientId,
    clientSecret: req.body.clientSecret,
    grantType: req.body.grantType,
    accessTokenUrl: req.body.accessTokenUrl,
  });
  res.json(tokenRes);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
