# Real World Example (GitHub App)

So far we've presented some admittely contrived scenarios.
While our simple examples (hopefully) clearly illustrate the fundamentals, as a developer you're likely to encounter far more complex situations.
Perhaps the most common of these situations is dealing with 3-legged authentication workflows.

The specific discussion of how 3-legged authentication (e.g. OpenID, OAuth1/2, etc.) works is somewhat out of scope of this tutorial step.
However generally 3-legged authentication workflows require permission grants from your end user to access their data in a data provider's system.
You typically receive some sort of identifiying token that you use to sign every request you make to a data provider that not only authenticates your application, but also indicates what user you're interacting on behalf of.
Keeping track of these tokens can be somewhat tedious and irregular.

In this step of the tutorial, we're going to introduce how to deal with 3-legged authentication directly with the BitScoop API Toolbox.
We'll be using a GitHub application as a sample app, so you'll want to create an OAuth application on your account.

[https://github.com/settings/applications/new](https://github.com/settings/applications/new)

You don't have an authorization callback URL provisioned for your in the BitScoop Auth API yet because we haven't created a Provider Map for this step.
However you can fill in a placeholder URL for the "Authorization callback URL" in your GitHub app.
We'll be sure to update it later.
Once you create your GitHub App, you should have access to the "Client ID" and "Client Secret" values.
You'll need these set in your Postman environment to complete this tutorial step.

To grab a copy of the collection we'll be using for this example click the button below.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c7a19e9070e2e86a7b26)


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

The practical difference between dealing with our previous examples and this one is that we'll be creating Connections on the BitScoop API Toolbox to our GitHub app.
A Connection in the BitScoop system holds all the authentication details pertinant to your end users in the 3-legged authentication workflow.
Instead of sending up any sort of request token to the data provider directly, you'll submit an additional header to the BitScoop Data API indicating which connection you'd like information for.

The typical workflow you'd send your users through is straightforward.

  1. Create a Connection for your Provider Map blindly in the BitScoop API Toolbox. You always operate under the assumption that you're dealing with a new user.
  2. Save a reference to the returned Connection ID in your database.
  3. Redirect your end-user to the `redirect_url` in the result of the Connection creation request programmatically using a 302.

After your end-user is redirected to the returned `redirect_url` they take a few steps outside your system.

  1. They're given the opportunity to grant your application permission to read their data.
  2. After doing so the data provider will redirect them to a URL that you set.
     Remember the "Authorization callback URL" from before? 
     If you're using the BitScoop API Toolbox, you'll have an callback URL provisioned for you automatically on the Auth API: `https://auth.api.bitscoop.com/done/[ProviderID]`.
  4. The BitScoop API Toolbox will handle completing the Connection you initially created.
  5. The BitScoop API Toolbox will finally redirect your end-user to a `redirect_url` you specify in the Provider Map and hand control of their user experience back to you.

At the end of this song and dance you'll should have a "completed" and "authorized" Connection object in the BitScoop API Toolbox.

## Postman Calls

You'll want to run the imported Postman calls in order.
However before running any calls remember to set some additional variables in your Postman environment.

```
github_client_id: [ClientID]
github_client_secret: [ClientSecret]
```

