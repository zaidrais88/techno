const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Preset username and password
const USERNAME = 'admin';
const PASSWORD = 'password123';

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Handle POST requests to /login
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';

    // Gather the data
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // End of data
    req.on('end', () => {
      const parsedBody = querystring.parse(body);
      const { username, password } = parsedBody;

      // Check credentials
      if (username === USERNAME && password === PASSWORD) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Login successful');
      } else {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Invalid username or password');
      }
    });

  // Serve the login form on GET requests
  } else if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
      </head>
      <body>
        <h1>Login</h1>
        <form action="/login" method="POST">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required>
          <br><br>
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required>
          <br><br>
          <button type="submit">Login</button>
        </form>
      </body>
      </html>
    `);

  // Handle 404 for other routes
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
const port = 3001;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
