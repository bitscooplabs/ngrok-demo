# ngrok-demo

This demo is a quick tour of how to configure the BitScoop API Toolbox to interact with "data providers," such as Facebook, Twitter, and GitHub, and the APIs they publish.

We'll be using a few key technologies that you'll want to familiarize yourself with before we get started. Please note that while we use these external technologies ourselves, we CANNOT OFFICIALLY ENDORSE THEM NOR BE HELD RESPONSIBLE for any issues with respect to security, etc. that you may encouter while using them.

Be sure to verify your downloads whenever possible using checksums or signatures to ensure their authenticity and origin especially if you're working with sensitive information.

After getting set up with these technologies, we'll walk you though creating a Provider Map on the BitScoop API Toolbox building up an example step-by-step. Finally we'll direct you to a more practical Provider Map that deals with a 3-legged authentication workflow.

You'll find source code in this repository to run your own mock "data provider," which will give you an opportunity to view the requests that the BitScoop API Toolbox makes in real time and in more granular detail.

## First things first, pre-requisites!

### ngrok

ngrok is a great tool for software developers that allows you to push local ports to temporarily available public URLs. If you're familiar with SSH remote port forwarding, this concept probably won't seem new to you. However the advantage of ngrok over plain SSH forwarding is the automatic provisioning of the public URLs and the fact that you don't need to configure any infrastructure yourself.

ngrok is a simple binary that you can download from [https://ngrok.com/download](https://ngrok.com/download). You can add the binary to your path and run it with:

```
ngrok http 5858
```

Which would expose a local HTTP application running on `http://localhost:5858` to an `ngrok.io` URL.

Note that if you'd prefer to plain SSH remote port forwarding, you'd certainly be able to do so, but you'd need to adapt some of these instructions accordingly. Any instructions hereafter assume that you're working with ngrok.

### Postman

Postman is Chrome app that lets you construct detailed HTTP requests and easily read and understand the responses. Think of it as an interactive `curl` for humans. That said, if you want to use `curl` we won't stop you!

If you have Chrome installed you'll want to visit [https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop). If you don't have Chrome installed you'll probably want to install it, but the installation instructions are out of scope of this demo.


## Get logged into BitScoop
