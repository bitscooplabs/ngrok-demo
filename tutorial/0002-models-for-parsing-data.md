# Models for Parsing Data

So far we haven't done anything particularly interesting with endpoint configurations.
The exact data that we'd receive from the localhost application is available through the BitScoop Data API.

In this step of the tutorial we're going to be applying some simple data transformations to what the data provider returns.

In order to parse information Provider Maps rely on configuring a "model" on a particular endpoint.
Models allow you to describe how you'd like your data to be returned.
While we're not going to cover everything you're able to do with models here, we will give you a few basic ideas.

To grab a copy of the collection we'll be using for this example click the button below.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/fd38d84e1c23362f5412)


## Provider Map

The Provider Map configuration we'll be using for this example is fundamentally the same as before, but has a couple of important new features.
Note that you don't need to worry about copy and pasting it into the BitScoop API Toolbox or Postman, we've already included it in the body of the POST request to create a new Provider Map.

```json
{
  "version": "1.0",
  "url": "http://localhost:5858",

  "endpoints": {
    "Posts": {
      "route": "/posts",
      "single": {
        "route": "/posts/{{ identifier }}"
      },
      "model": {
        "key": "id",
        "fields": {
          "id": "integer",
          "title": "string",
          "userId": "integer"
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

We've added a `model` configuration to both the `Posts` endpoint and the `Users` endpoint.

The `Posts` model effectively filters the `body` field from the original data.
So if you were uninterested in extraneous data returned from a data provider you could drastically reduce the amount of data consumed by your infrastructure.

The `Users` model filters certain field and additionally introduces the idea of parsing data.
The `email` data returned from your local data provider is a string, but the our Provider Map is configured to parse it as an email address.
This will result a string like `"John Doe" <jdoe@example.com>` to be automatically parsed into an email object such as:

```json
{
  "name": "John Doe",
  "address": "jdoe@example.com"
}
```

## Postman Calls

You'll want to run the imported Postman calls in order.
You should be able to view every request that comes into your local server.

### Create BitScoop Provider Map
This call will send a POST request to the BitScoop API Toolbox and configure a Provider Map automatically using roughly the configuration above.
The ID of the Provider Map will be saved to your environment automatically.

### Posts Collection/Instance
These calls will send GET requests to the dynamically provisioned Posts endpoint on the BitScoop Data API.
Notice the filtered `body` field in the data that's returned.

### Users Collection/Instance
These calls will send GET requests to the dynamically provisioned Users endpoint on the BitScoop Data API.
Notice not only the filtered fields, but the new structure of the `email` field in the end-result.
