# Handling Basic Authentication

So far we've operated under the assumption that we're dealing with a public API using no authentication.
This obviously isn't always the case, but the BitScoop API Toolbox gives you some tools to deal with data providers that require authentication.

In this step of the tutorial, we're simply going to add an environment and a few global headers.
When you create a Provider Map you're able to create a simple key/value environment with variables that will be available on the context.
You're also able to add headers and parameters that will be sent to the data provider on every request.
Note that if you'd prefer more granularity when sending headers and parameters, you can specify these same options on the endpoint configurations of the `single` and `collection` subsections of endpoint configurations.
The most specific value will always take precedence.

To grab a copy of the collection we'll be using for this example click the button below.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/f007827d898a464693cb)


## Provider Map

The Provider Map configuration we'll be using for this example is again fundamentally the same as before, but has one important new feature.

```json
{
  "version": "1.0",
  "url": "http://localhost:5858",

  "environment": {
    "api_key": "12345"
  },

  "headers": {
    "Authorization": "Bearer {{ environment.api_key }}",
    "X-Foo": "Bar"
  },

  "endpoints": {
    "Posts": {
      "route": "/posts",
      "populate": "*",
      "single": {
        "route": "/posts/{{ identifier }}"
      },
      "model": {
        "key": "id",
        "fields": {
          "id": "integer",
          "title": "string",
          "userId": {
            "type": "integer",
            "serialized": false
          },
          "user": {
            "type": "related",
            "ref": "Users",
            "reverse": {
              "identifier": "{{ model.userId }}"
            }
          }
        }
      }
    },
    "Users": {
      "route": "/users",
      "single": {
        "route": "/users/{{ identifier }}"
      },
      "model": {
        "key": "id",
        "fields": {
          "id": "integer",
          "name": "string",
          "username": "string",
          "email": "email"
        }
      }
    }
  }
}
```

We've simply added global configuration sections `environment` and `headers` here.

The specific headers that will now be sent with every request are:

```
Authorization: Bearer 12345
X-Foo: Bar
```

Note that Express + NodeJS will text transform the header values to lower case, so we'll notice the raw values parsed as `authorization` and `x-foo`, respectively.
This isn't a bug in the BitScoop API Toolbox.

In this simple case we've created a reference to the environment variable `api_key` on the authorization header value.
We could have very well put our API key directly in the authorization header specification.
However ultimately we'd like you to have granular control over what BitScoop API keys have access to your Provider Map environments.
We also wanted to demonstrate the fact that you can indeed create an environment with globally accessable values that can be used for various hydrations or parsing data, etc.

## Postman Calls

You'll want to run the imported Postman calls in order.
You should be able to view every request that comes into your local server.

### Create BitScoop Provider Map
This call will send a POST request to the BitScoop API Toolbox and configure a Provider Map automatically using roughly the configuration above.
The ID of the Provider Map will be saved to your environment automatically.

### Posts Instance
This call will send a GET request to the dynamically provisioned Posts instance endpoint on the BitScoop Data API.
The API Toolbox will, in turn, send two requests to your published local application.
The first request should be to the individual post you've indirectly requested, the second will be a request to the endpoint associated with the user instance associated with that post.
Pay particular attention to the headers that are logged by your local application.
You should see the expected header values for `authorization` and `x-foo`.
