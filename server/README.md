# Local "Data Provider" Server

This server


## Installing project requirements

You won't be able to run the server unless you first install the requirements.

```
npm install
```

## Running the server

The server is configured to use port 5858 by default.
If you want to use a different port you can change the default value by editing the address in `config/default.json`.
Once you're happy with the configuration you can boot the server with:

```
node app.js
```

You should see a boot message if everything worked.

<img src="https://d233zlhvpze22y.cloudfront.net/screenshots/demos/ngrok-demo/server-boot.png" height="500px" />

If the server is running you should be able to request resources from it, e.g.:

```
curl -v localhost:5858/users
```

Every request you make to the server will be logged.

<img src="https://d233zlhvpze22y.cloudfront.net/screenshots/demos/ngrok-demo/test-request.png" height="500px" />

Notice the information you have available in the logs:

**id** &ndash; A UUID4 assigned to the request.

This helps determine which response correlated to which request. Typically requests will be fulfilled fast enough that their response is logged immediately after the request itself is, but it is possible to start processing additional requests before previous requests have finished.

**ip** &ndash; The IP of the request origin.

**method** &ndash; The HTTP method used by the request.

**path** &ndash; The specific resource requested on the server.

**headers** &ndash; A key/value list of headers that were submitted with the request.

Note that NodeJS + Express will text transform all header names to lower case.

**parameters** &ndash; A key/value list of parameters that were submitted as query parameters.
 
