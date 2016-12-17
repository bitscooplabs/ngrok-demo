# Diving into Provider Maps

Within the BitScoop API Toolbox, a Provider Map is a JSON configuration that controls the interactions with a data provider.
We've put together a few examples here that we hope will help you understand how to configure Provider Maps.

Each tutorial step will contain a Postman collection so that you can easily inspect and execute requests to the BitScoop API.
For your reference we've also included the Provider Map samples used for each step in the [`samples`](https://github.com/bitscooplabs/ngrok-demo/tree/master/tutorial/samples) folder.

You can always jump to a specific step from this page:

  1. [Basic Example](https://github.com/bitscooplabs/ngrok-demo/blob/master/tutorial/0001-basic-example.md)
  2. [Models for Parsing Data](https://github.com/bitscooplabs/ngrok-demo/blob/master/tutorial/0002-models-for-parsing-data.md)
  3. [Adding Relations & Hydration](https://github.com/bitscooplabs/ngrok-demo/blob/master/tutorial/0003-adding-relations-and-hydration.md)
  4. [Handling Basic Authentication](https://github.com/bitscooplabs/ngrok-demo/blob/master/tutorial/0004-handling-basic-authentication.md)
  5. [Real World Example (GitHub app)](https://github.com/bitscooplabs/ngrok-demo/blob/master/tutorial/0005-real-world-example.md)

Before you start any of the tutorial steps, you'll want to set up your local "data provider," Postman, and ngrok.


## Run your local "data provider"

The local mock "data provider" server included in this repository is configured to use port 5858 by default.
If you want to use a different port you can change the default value by editing the address in `config/default.json`.
Once you're happy with the configuration you can boot the server with:

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

Feel free to peruse the server code, but know that the way in which instance responses (e.g. `http://localhost:5858/users/1`) are prepared isn't particularly efficient and shouldn't be used as an example (generally you'd be using a database anyway, so it's a moot point).


## Start ngrok

Once you have your local server running you can temporarily publish it to the internet with ngrok.

```
ngrok http 5858
```

<img src="https://d233zlhvpze22y.cloudfront.net/screenshots/demos/ngrok-demo/ngrok-boot.png" height="500px" />

This will expose your local HTTP application running on `http://localhost:5858` to an `ngrok.io` URL (in this case `http(s)://d81d8eab.ngrok.io.`).

Any request made to the assigned ngrok URL will be processed by the ngrok servers and securely forwarded to your local application.
Your application, in turn, will process the request, securely forward the response back to ngrok servers which will send the response back to the end-user who originally requested the resource.


## Set up Postman

The Postman portion of this demo requires you to set up an environment and import some collections we've made.

An environment is simply a list of key/values that can be referenced by Postman calls.
The environment may be dynamically updated in response to Postman calls you send.

### Import and edit an environment

We've created an environment that you'll want to import into your copy of Postman.
Click on the gear icon in the top right of the Postman window and then on "Manage Environments" to open the environment management modal.

<img src="https://d233zlhvpze22y.cloudfront.net/screenshots/demos/ngrok-demo/manage-postman-environments-01.png" height="500px" />

<img src="https://d233zlhvpze22y.cloudfront.net/screenshots/demos/ngrok-demo/manage-postman-environments-02.png" height="500px" />

Go ahead and click on "Import" to load up the environment included in this folder.
If you'd prefer to set the variables manually, you can certainly do so, just make sure not to misspell any of the variable names.

<img src="https://d233zlhvpze22y.cloudfront.net/screenshots/demos/ngrok-demo/manage-postman-environments-03.png" height="500px" />

Fill in the values for your ngrok URL (obtainable from the ngrok window), localhost port (5858 or whatever you picked), and API key.
If you still need to create an API key, head to [https://developer.bitscoop.com/keys](https://developer.bitscoop.com/keys), create an API key, and copy in the token.

The individual collections will be importable from each tutorial step.
When you import a collection you'll see a window giving you choice on how to import the collection.

<img src="https://d233zlhvpze22y.cloudfront.net/screenshots/demos/ngrok-demo/import-postman-collection.png" height="500px" />
