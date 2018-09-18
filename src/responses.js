const fs = require('fs');
const url = require('url');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, status, id, message, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    if (status !== 200) responseXML = `${responseXML} <id>${id}</id>`;
    responseXML = `${responseXML} <message>${message}</message>`;
    responseXML = `${responseXML} </response>`;

    response.writeHead(status, { 'Content-Type': 'text/xml' });
    response.write(responseXML);
    return response.end();
  }
  const myJson = {
    message,
  };
  if (status !== 200) myJson.id = id;

  const jsonString = JSON.stringify(myJson);

  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(jsonString);
  return response.end();
};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  return response.end();
};

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  return response.end();
};

const get200 = (request, response, acceptedTypes) => respond(request, response, 200, 'success', 'This is a successful response', acceptedTypes);

const get400 = (request, response, acceptedTypes) => {
  // check for ?valid=true
  const parsedUrl = url.parse(request.url);
  if (parsedUrl.search === '?valid=true') {
    return respond(request, response, 200, 'success', 'This request has the required parameters', acceptedTypes);
  }
  return respond(request, response, 400, 'Bad Request', 'Missing valid query parameter set to true', acceptedTypes);
};

const get401 = (request, response, acceptedTypes) => {
  // check for ?loggedIn=yes
  const parsedUrl = url.parse(request.url);
  if (parsedUrl.search === '?loggedIn=yes') {
    return respond(request, response, 200, 'success', 'You have successfully viewed the content.', acceptedTypes);
  }
  return respond(request, response, 401, 'Unauthorized', 'Missing loggedIn query parameter set to yes', acceptedTypes);
};

const get403 = (request, response, acceptedTypes) => {
  respond(request, response, 403, 'Forbidden', 'You do not have access to this content.', acceptedTypes);
};

const get404 = (request, response, acceptedTypes) => {
  respond(request, response, 404, 'Resource Not found', 'The page you are looking for was not found.', acceptedTypes);
};

const get500 = (request, response, acceptedTypes) => {
  respond(request, response, 500, 'Internal server error', 'Something went wrong.', acceptedTypes);
};

const get501 = (request, response, acceptedTypes) => {
  respond(request, response, 501, 'Not implemented', 'A get request for this page has not been implemented yet. Check again later for updated content.', acceptedTypes);
};

module.exports = {
  getIndex,
  getStyle,
  get200,
  get400,
  get401,
  get403,
  get404,
  get500,
  get501,
};
