# Worker poc

## Cloud functions

I've created gcloud functions out of all these plugins to show how a function looks like.

## Test plugins

### gatsby-plugin-remote-file

Downloads a file and saves it to disk

```js
{
  resolve: '@wardpeet/gatsby-plugin-remote-file',
  options: {
    url: 'https://images.unsplash.com/photo-1568794065652-b9642d4be0ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    ouputFilename: 'forest.jpg',
  }
},
```

### gatsby-plugin-sharp-worker

Converts an inputFile to outputDir

```js
{
  resolve: '@wardpeet/gatsby-plugin-sharp-worker',
  options: {
    inputPaths: ['./src/images/gatsby-astronaut.png'],
    digest: '1234',
  }
}
```

### gatsby-plugin-sqip-worker

Runs a worker and returns a result

```js
{
  resolve: '@wardpeet/gatsby-plugin-sqip-worker',
  options: {
    inputPaths: ['./src/images/gatsby-astronaut.png'],
  }
}
```

### gatsby-plugin-structured-logging-worker

Runs a worker and throws a structured log

```js
{
  resolve: '@wardpeet/gatsby-plugin-structured-logging-worker',
  options: {}
}
```
