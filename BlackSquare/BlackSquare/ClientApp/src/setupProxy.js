const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:63501';

const context =  [
    "/weatherforecast",
    "/move"
];

module.exports = function(app) {
  const appProxy = createProxyMiddleware(context, {
      target: target,
      secure: false,
      ws: true,
      changeOrigin: true,
      onError: function (err, req, res) {
          console.log(err);
          res.writeHead(500, {
              'Content-Type': 'text/plain'
          });
          res.end(err);
      }
  });

  app.use(appProxy);
};
