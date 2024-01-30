const express = require('express');
const request = require('request');
const app = express();

const PORT = 3001; // The port you want your proxy to listen on
const PRISMA_STUDIO_PORT = 5555; // The port your Prisma Studio runs on

app.use('/', (req, res) => {
  let url = `http://localhost:${PRISMA_STUDIO_PORT}${req.url}`;
  // Remove the unwanted parameter
  url = url.replace(/\?vscodeBrowserReqId=\d+/, '');
  // Forward the request to Prisma Studio without the parameter
  req.pipe(request(url)).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
