# Real World Example (GitHub App)

So far we've presented some admittely contrived scenarios.
While our simple examples (hopefully) clearly illustrate the fundamentals, as a developer you're likely to encounter far more complex situations.
Perhaps the most common of these situations is dealing with 3-legged authentication workflows.

The specific discussion of how 3-legged authentication (e.g. OpenID, OAuth1/2, etc.) works is somewhat out of scope of this tutorial step.
Generally, 3-legged authentication workflows require permission grants from your end user to access their data in a data provider's system.
You typically receive some sort of identifiying token that you use to sign every request you make to a data provider that not only authenticates your application, but also indicates what user you're interacting on behalf of.
Keeping track of these tokens can be somewhat tedious and irregular.

In this step of the tutorial, we're going to introduce how to deal with 3-legged authentication directly with the BitScoop API Toolbox.
We'll be using a GitHub application as a sample app, so you'll want to create an OAuth application on your account.

[https://github.com/settings/applications/new](https://github.com/settings/applications/new)

You don't have an authorization callback URL provisioned for your in the BitScoop Auth API yet because we haven't created a Provider Map for this step.
However, you can fill in a placeholder URL for the "Authorization callback URL" in your GitHub app.
We'll be sure to update it later.
Once you create your GitHub App, you should have access to the "Client ID" and "Client Secret" values.
You'll need these set in your Postman environment to complete this tutorial step.

To grab a copy of the collection we'll be using for this example click the button below.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c7a19e9070e2e86a7b26)

The practical difference between dealing with our previous examples and this one is that we'll be creating Connections on the BitScoop API Toolbox to our GitHub app.
A Connection in the BitScoop system holds all the authentication details pertinent to your end users in the 3-legged authentication workflow.
Instead of sending up any sort of request token to the data provider directly, you'll submit an additional header to the BitScoop Data API indicating which connection you'd like information for.

The typical workflow you'd send your users through is straightforward.

  1. Create a Connection for your Provider Map blindly in the BitScoop API Toolbox. You always operate under the assumption that you're dealing with a new user.
  2. Save a reference to the returned Connection ID in your database.
  3. Redirect your end-user to the `redirect_url` in the result of the Connection creation request programmatically using a 302.

After your end-user is redirected to the returned `redirect_url` they take a few steps outside your system.

  1. They're given the opportunity to grant your application permission to read their data.
  2. After doing so the data provider will redirect them to a URL that you set.
     Remember the "Authorization callback URL" from before?
     If you're using the BitScoop API Toolbox, you'll have a callback URL provisioned for you automatically on the Auth API: `https://auth.api.bitscoop.com/done/[ProviderID]`.
  4. The BitScoop API Toolbox will handle completing the Connection you initially created.
  5. The BitScoop API Toolbox will finally redirect your end-user to a `redirect_url` you specify in the Provider Map and hand control of their user experience back to you.

At the end of this song and dance you'll should have a "completed" and "authorized" Connection object in the BitScoop API Toolbox.
In the context of this example, these two values are largely synonymous, however if you ever need to update the scopes on your connection the value of "authorized" will be automatically toggled to `false` until your end-user goes through the permission grant steps again.


## Provider Map

The Provider Map configuration we'll be using for this example is again fundamentally the same as before, but has one important new feature.

```json
{
  "version": "1.0",
  "url": "https://api.github.com",

  "auth": {
    "type": "oauth2",
    "redirect_url": "https://www.google.com",
    "authorization_url": "https://github.com/login/oauth/authorize",
    "access_token": "https://github.com/login/oauth/access_token",
    "signature": "parameter",
    "auth_key": null,
    "auth_secret": null
  },

  "meta": {
    "uniqueness_location": "login",
    "default_name_location": "login",
    "endpoint": {
      "method": "GET",
      "route": "/user",
      "model": {
        "key": "login",
        "fields": {
          "login": "string"
        }
      }
    }
  },

  "endpoints": {
    "User": {
      "route": "/user",
      "single": false,
      "model": {
        "key": "name",
        "fields": {
          "name": "string",
          "id": "number",
          "login": "string"
        }
      }
    },
    "Repos": {
      "scopes": [
        "repo",
        "repo:status"
      ],
      "route": "/user/repos",
      "single": false
    }
  }
}
```

This Provider Map does not build on those found in the previous steps, but instead focuses on dealing with the authentication found on the GitHub API.

The `auth` configuration specifies that we're working with OAuth2 and that we'd like to redirect our users to `https://www.google.com` after they've completed the Connection with the BitScoop Data API.
There are some additional settings that further describe the OAuth2 interaction with the data provider that vary from provider to provider.
Of particular note is the `signature` setting which specifies that any authentication signatures should be attached to query parameters in requests to the data provider.
You'd need to peruse the documentation of individual data providers to get an idea of what settings to use for `authorization_url`, `access_token`, `signature`, etc.

An API leveraging a 3-legged authentication workflow will often make some information available about the user associated with a particular request token.
This "metainformation" typically includes an ID of the user in the data provider's system, the username, the full name, email, etc.
The optional `meta` configuration specifies where such metainformation about the Connection can be obtained after it is completed.
As part of the Connection completion process this information will be obtained automatically if configured.

Of particular interest are the `uniqueness_location` and `default_name_location` settings in the `meta` configuration.

The `default_name_location` setting will apply the value found in the location specified as the "name" of the connection in the BitScoop API Toolbox.
This is optional and mainly just for your convenience and recordkeeping.

The `uniqueness_location` stipulates that an authenticated connection should be unique based on the indicated data location.
Remember how we said that we're always operating under the assumption that an unauthenticated user is a new user?
Well, what if they aren't?
Basically the Connection will be completed either way, but the API Toolbox will verify Connection uniqueness if configured.
The oldest Connection takes precedence.

We've also added a `scopes` setting to the `Repos` endpoint configuration.
This means that in order to request information from the endpoint mapped on the data provider for the `Repos` endpoint, your end-user needs to have granted you the indicated permissions.
A global list of scopes is automatically calculated for you when you create a Connection based on your configured endpoints.
This allows you to specifically indicate which scopes are necessary for which endpoints, yet still obtain permissions for all Endpoints necessary for your applications.

## Postman Calls

You'll want to run the imported Postman calls in order.
However, before running any calls remember to set some additional variables in your Postman environment.

```
github_client_id: [ClientID]
github_client_secret: [ClientSecret]
```

### Create BitScoop Provider Map
This request will create a Provider Map in the BitScoop API Toolbox and set the environment variable `step_0005_provider_id` automatically.

After submitting this request, you'll need to go to your app settings on GitHub and update the "Authorization callback URL" with this value to:

```
https://auth.api.bitscoop.com/done/[step_0005_provider_id]
```

### Create Connection to GitHub app
This request will create a Connection in the BitScoop API Toolbox.
The returned data will look something like:

```json
{
  "id": "abcdef1234567890",
  "redirect_url": "some ludicrously long URL that means nothing to normal humans"
}
```

Remember the `id` value is the ID of the newly created Connection.
If you're working with the BitScoop API Toolbox inside one of your applications, you'll need to save a reference to this ID somewhere.
You can always get the list of all your current connections for a particular Provider Map.
However if you want to, for example, associate a Connection with a particular user of your system, you'll need to set that somewhere.
In this case the Connection ID is saved automatically as a Postman environment variable and used for the "Repos Collection" call.

The `redirect_url` is the location where you should programmatically redirect the end-user interacting with your system.
In this example we're not inside an application so you'll want to open a separate browser tab and visit the URL manually.
If everything worked you should be redirected to `https://www.google.com` as was configured in the Provider Map.

### Connections Collection
After completing your new connection by manually visiting the returned `redirect_url` you can use this request to list your current connections.
You'll get back some information that's stored on the connection including any tokens used for authenticating against the data provider itself.
So in theory if you wanted to make raw calls to the data provider yourself you'd be able to do so by first getting the authentication information from the BitScoop Data Toolbox.

Note that if you were to delete a Provider Map the Connections associated with it are NOT AUTOMATICALLY DELETED.
We set this up specifically so that you do not lose access to important authentication information that would result in you having to re-obtain permissions from each of your users.

### Repos Collection
This request will request data from the provisioned `Repos` endpoint on the BitScoop Data API.
The `X-Connection-ID` header will be used to indicate that you'd like to request information for the Connection you created above.
If everything worked you should receive raw data from the GitHub API listing your repositories.

### Clear Connections
If you'd like to reset all your connections for your Provider Map you can execute this call.
We tend to use this call for development and demo purposes, but find little use for it in a production environment where you'd probably be submitting a DELETE request for a single connection.
