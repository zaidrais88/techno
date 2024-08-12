const http = require('http');
const querystring = require('querystring');
const promClient = require('prom-client');

// Preset username and password
const USERNAME = 'admin';
const PASSWORD = 'password123';

// Create a Registry which registers the metrics
const register = new promClient.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'nodejs-login-app'
});

// Enable the collection of default metrics
promClient.collectDefaultMetrics({ register });

// Create a custom counter metric for login attempts
const loginAttempts = new promClient.Counter({
  name: 'login_attempts_total',
  help: 'Total number of login attempts',
  labelNames: ['status'], // 'success' or 'failure'
});

loginAttempts.inc({ status: 'success' });
loginAttempts.inc({ status: 'failure' });

register.registerMetric(loginAttempts);

register.metrics().then((metrics) => {
  console.log(metrics);
});
// Create an HTTP server
const server = http.createServer((req, res) => {
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
        loginAttempts.inc({ status: 'success' });
        console.log(`Login successful for user: ${username}`);
		console.log('Incremented success login metric');
      } else {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Invalid username or password');
        loginAttempts.inc({ status: 'failure' });
        console.log(`Login failed for user: ${username}`);
		console.log('Incremented failure login metric');
      }
    });

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

  } else if (req.method === 'GET' && req.url === '/metrics') {
    // Handle the /metrics endpoint asynchronously
    register.metrics().then((metrics) => {
      res.writeHead(200, { 'Content-Type': register.contentType });
      res.end(metrics);
    }).catch((err) => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error retrieving metrics');
      console.error('Error retrieving metrics:', err);
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    console.log(`404 Not Found: ${req.method} ${req.url}`);
  }
});

// Export the server instance for testing
module.exports = server;

// Start the server only if this file is executed directly
if (require.main === module) {
  const port = 3001;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
