# Adding Relations and Hydration

We've thus far introduced a way to interact with data providers via dynamically provisioned endpoints on the BitScoop Data API using Provider Maps.
We've also configured a few models on these endpoints to affect how the data is parsed before it is returned to your applications.
In this step of the tutorial we're going to introduce how you might start to describe relationships in your data and some features of the BitScoop API Toolbox that will help you reduce the number of calls you make to data providers.

When you're dealing with relational databases, you often have the convenience of creating relationships in your data model.
Many Object-relational mapping (ORM) solutions are availble for various languages that drastically simplify the process of returning and processing data.

When you're working with an API, it is rare that the data provider will stipulate any relationships in the the resources available to you.
Instead you're often tasked in your application to keep track of data relationships on the code level.
This can result in complex solutions intended to reuse data where possible or a disproportionally large number of requests sent to the data provider.

In this step of the tutorial, we're going to describe a simple relationship between `posts` and `users` and explain how to work with this relationship using the BitScoop API Toolbox.

To grab a copy of the collection we'll be using for this example click the button below.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/32e9bc20b4f6d78da6cd)


## Provider Map

The Provider Map configuration we'll be using for this example is again fundamentally the same as before, but has one important new feature.

```json
{
  "version": "1.0",
  "url": "http://localhost:5858",

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

We've added an additional field to the `model` configuration on the `Posts` endpoint that indicates a relationship to the `Users` endpoint.
We've also updated the description of the `userId` field on the `Posts` model to prevent it from being serialized in our final result.
Note that we still need the `userId` available for our data processing which is why we can't just get rid of the field entirely.

The related field configuration indicates the endpoint that it references using the `ref` setting and specifies the data that it passes to the `Users` endpoint with the `reverse` configuration.
In this case we're passing the dynamically evaluated context value `model.userId` *forward* to the `Users` endpoint.
The `Users` endpoint, in turn, understands that it should request information using the indicated `identifier` and makes a call itself.

We've added a `populate` setting to the `Posts` endpoint so that any call to it will automatically hydrate the individual posts that it processes.
Note that this value can be overridden by submitting an `X-Populate` HTTP header directive.
The literal value `*` indicates that the population dependency tree should be automatically calculated by the BitScoop API Toolbox.
If you were to have a relationship defined on the `Users` endpoint, the `*` would result in that relationship being hydrated as well.

The final result is only returned to your application when all of the requests are finished.
This can sometimes result in a perceived latency, however keep in mind that based on your configuration there might be thousands of requests made on your behalf by the BitScoop API Toolbox.

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

### Posts Collection
This call will send a GET request to the dynamically provisioned Posts collection endpoint on the BitScoop Data API.
The hydration behavior is largely similar to that seen in the Posts Instance call, however pay particular attention to how many requests are being made to the individual user endpoints.

If you have not altered the posts data, there will be several posts that share the same user.
The BitScoop API Toolbox will recycle the requests made to the indidual users to reduce the number of requests send to data providers.
This temporal cache will live for the duration of the request you make to the API Toolbox.
So if you send the Postman request again you should notice another 10 or so calls to the `/users` resource on your local application.
