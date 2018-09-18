const http = require('http');
const url = require('url');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStatic = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getStyle,
};
const urlStruct = {
  404: responseHandler.get404,
  '/success': responseHandler.get200,
  '/badRequest': responseHandler.get400,
  '/unauthorized': responseHandler.get401,
  '/forbidden': responseHandler.get403,
  '/internal': responseHandler.get500,
  '/notImplemented': responseHandler.get501,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const acceptedTypes = request.headers.accept.split(',');

  if (urlStatic[parsedUrl.pathname]) {
    urlStatic[parsedUrl.pathname](request, response);
  } else if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes);
  } else {
    urlStruct['404'](request, response, acceptedTypes);
  }
};

http.createServer(onRequest).listen(port);
console.log(`Listening on port ${port}`);
