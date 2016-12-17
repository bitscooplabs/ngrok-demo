# Basic Example

This example assumes you're running your local data provider and ngrok and that you've set up Postman already.

To grab a copy of the collection we'll be using for this example click the button below.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/defd8ae28c370a8fedc0)


## Provider Map

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
