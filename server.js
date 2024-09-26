const express = require('express');
require('dotenv').config();

const app = express();
const port = 9998;

const fetchToken = async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify({
        "client_id": process.env.CLIENT_ID,
        "client_secret": process.env.CLIENT_SECRET,
        "grant_type": process.env.GRANT_TYPE,
    });

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: body,
        redirect: "follow"
    };
    
    const res = await fetch(process.env.TOKEN_URL, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));

    return {
        access_token: res.access_token,
        token_type: res.token_type,
        expires_in: res.expires_in,
    };
};

app.get('/', async (req, res) => {
    const tokenRes = await fetchToken();
    res
      .cookie('_access_token', `${tokenRes.access_token}`, { httpOnly: false, maxAge: tokenRes.expires_in * 1000 })
      .send('Token has been set in the cookie');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
