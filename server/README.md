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

You should see a boot message if everything worked and you'd be able to hit a URL like `http://localhost:5858/users`.

![](https://d233zlhvpze22y.cloudfront.net/screenshots/demos/ngrok-demo/server-boot.png)

```
curl -v localhost:5858/users
```
