# Basic Example

This example assumes you're running your local data provider and ngrok and that you've set up Postman already.

To grab a copy of the collection we'll be using for this example click the button below.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/defd8ae28c370a8fedc0)


## Provider Map

The Provider Map configuration we'll be using for this example has a couple of important features.
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
      }
    },
    "Users": {
      "route": "/users",
      "single": {
        "route": "/users/{{ identifier }}"
      }
    }
  }
}
```

The `version` property is a string that indicates which version of the BitScoop API Toolbox Provider Map specification your provider map subscribes to.
Right now your only option is `"1.0"`, but additional versions will be added in the future.
If features from an older specification become deprecated, you'll be given some time to migrate your Provider Map to any new specification.

The `url` property is a string that configures the base URL from which the API Toolbox should request data.
Note that this sample Provider Map has a reference to an unreachable destination.
You don't need to worry about this since your Provider Map will be pointed to your ngrok URL.

The `endpoints` property is an object that contains key/value pairs configuring individual endpoint mappings.
Each specified endpoint mapping dynamically provisions up to two queryable endpoints on the BitScoop Data API according to the pattern:

```
https://provider.api.bitscoop.com/[ProviderMapID]/[EndpointName]
https://provider.api.bitscoop.com/[ProviderMapID]/[EndpointName]/[identifier]
```

The path without an identifier is considered the `collection` path and can be configured separately from the `single` path.
Many settings can be defined on the top level of the endpoint specification and overridden on the respective `collection` and `single` sub-sections.
For example, the `Posts` endpoint configured in this example specifies that the `route` that the API Toolbox should call is `http://localhost:5858/posts` when a request is made to `https://provider.api.bitscoop.com/[ProviderMapID]/Posts`

Similarly when a request is made to `https://provider.api.bitscoop.com/[ProviderMapID]/Posts/1` the literal `1` is passed forward on the context available to the Provider Map call.
Notice the `route` is overridden on the `single` configuration and contains an evaluated reference.
The context is used to evaluate this route at runtime ultimately resulting in an external call to `http://localhost:5858/posts/1`.


## Postman Calls

You'll want to run the imported Postman calls in order.
You should be able to view every request that comes into your local server.

### Native Posts Collection
This call will send a GET request directly to the url `http://localhost:5858/posts`.
You should be able to see the result that you'd get directly from the data provider without any modification.

### Native Users Collection
Similarly, this call will send a GET request directly to the url `http://localhost:5858/users` to give you an idea of what the user data looks like inherently.

### Ngrok Posts Collection
This call will send a GET request to the `/posts` collection on the ngrok URL which should in turn directly forward the request to your local application.
You shouldn't notice any difference in the returned data, but you will notice an increased latency.
This is to be expected since you're adding a few extra steps to network path.

### Create BitScoop Provider Map
This call will send a POST request to the BitScoop API Toolbox and configure a Provider Map automatically using roughly the configuration above (the `url` will be different).

### Mapped Posts Collection
This call will send a GET request to the dynamically provisioned BitScoop Data API endpoint `https://provider.api.bitscoop.com/[ProviderMapID]/Posts`.
Since we haven't done anything particularly interesting with our endpoint configurations, the data returned will be exactly the same as the previous results.


## Recap

After making it through this step of the tutorial we've configured a basic Provider Map with dynamically provisioned, callable endpoints and seen some of requests that the BitScoop API Toolbox will make to a data provider.
