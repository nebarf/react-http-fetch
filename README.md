<h1 align="center">React http fetch</h1>

<p align="center">
  <img src="assets/img/react-http-fetch-logo.png" alt="react-http-fetch logo" width="120px" height="120px"/>
  <br>
  <i>A http library for React JS built on top of JS native fetch.</i>
  <br>
</p>

<p align="center">
  <a href="CONTRIBUTING.md">Contributing Guidelines</a>
  ·
  <a href="CHANGELOG.md">Changelog</a>
  <br>
  <br>
</p>

<p align="center">
  <a href="https://github.com/nebarf/react-http-fetch/actions/workflows/status-check.yml">
    <img src="https://github.com/nebarf/react-http-fetch/actions/workflows/status-check.yml/badge.svg" alt="Build status" />
  </a>&nbsp;
  <a href="https://www.npmjs.com/react-http-fetch">
    <img src="https://img.shields.io/npm/v/react-http-fetch.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="react-http-fetch on npm" />
  </a>&nbsp;
  <a href="http://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/npm/l/react-http-fetch.svg?color=lime-green" alt="MIT license" />
  </a>
</p>

<hr>
<br>

## Documentation

Just follow links below to get an overview of library features.
- [Documentation](#documentation)
- [Getting started](#getting-started)
- [Provider](#provider)
- [Http client](#http-client)
  - [Public API](#public-api)
  - [Request params](#request-params)
  - [Request return](#request-return)
  - [Abortable request return](#abortable-request-return)
  - [Example &ndash; Abortable request](#example--abortable-request)
  - [Example &ndash; Get request](#example--get-request)
- [Request hooks](#request-hooks)
- [Events](#events)
- [Caching](#caching)
- [Browser support](#browser-support)

<br>

## Getting started

Install the package by using npm

```
npm install react-http-fetch
```

or yarn

```
yarn add react-http-fetch
```

## Provider
You can override the default configuration used by the http client to peform any request by using the `HttpClientConfigProvider`:

```js
import { defaultHttpReqConfig, HttpClientConfigProvider } from 'react-http-fetch';

function Child() {
  return (
    <div> Child component </div>
  );
};

function httpResponseParser(res) {
  return res.json();
}


function App() {
  /**
   * Provided configs are automatically merged to the default one.
   */
  const httpReqConfig = {
    // ...defaultHttpReqConfig,
    baseUrl: process.env.BACKEND_URL,
    responseParser: httpResponseParser,
    reqOptions: {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
    },
  };

  return (
    <HttpClientConfigProvider config={httpReqConfig}>
      <Child />
    </HttpClientConfigProvider>
  );
}

export default App;
```

Below the complete set of options you can provide to the `HttpClientConfigProvider`:

| Option | Description | Default |
| --------------------- | --------------------------------------------------------------------------|------------- |
|baseUrl|The base url used by the client to perform any http request (e.g. http://localhost:8000)|```''```
|responseParser|A function that maps the native fetch response. The default parser transform the fetch response stream into a json (https://developer.mozilla.org/en-US/docs/Web/API/Response/json)|[httpResponseParser](src/config/response-parser.ts)
|requestBodySerializer|A function used to serialize request body. The default serializer take into account a wide range of data types to figure out which type of serialization to perform|[serializeRequestBody](src/config/request-body-serializer.ts)
|reqOptions|The default request option that will be carried by any request dispatched by the client. See [HttpRequestOptions](src/client/types.ts)|```{ headers: { 'Content-Type': 'application/json' } }```
|cache|A service used to cache http responses. [HttpCache](src/cache/http-cache.ts) can be used as reference to provide your own implementation. By default it uses an in-memory cache.|[HttpInMemoryCacheService](src/cache/http-in-memory-cache.ts)

<br>

## Http client
The `useHttpClient` hook return a set of method to perform http requests. The `request` function is the lowest level one, all other exposed functions are just decorators around it. Below a basic example using `request`:

```js
import { useHttpClient } from 'react-http-fetch';


function App() {
  const { request } = useHttpClient();

  const [todo, setTodo] = useState();

  useEffect(
    () => {
      const fetchTodo = async () => {
        const res = await request({
          baseUrlOverride: 'https://jsonplaceholder.typicode.com',
          relativeUrl: 'todos/1',
          requestOptions: {
            method: 'GET',
          },
        });
        setTodo(res);
      };

      fetchTodo();
    },
    [request]
  );

  return (
    <div>{`Todo name: ${todo && todo.title}`}</div>
  );
}

export default App;
```

<style>
.httpRequestsList li {
  margin-left: -22px
}
</style>


### Public API

The complete *public API* exposed by the hook:
| Method | Description | Params | Return |
| --------------------- | --------------------------------------------------------------------------| --------------------- | --------------------- | 
|request | The lowest level method to perform a http request | params| return
| <ul class="httpRequestsList"><li>get</li><li>post</li><li>put</li><li>patch</li><li>delete</li></ul> | Make use of lower level method `request` by just overriding the http method ([example](#example-get-request)) | params | return
| abortableRequest | The lowest level method to perform an abortable http request | params | return
| <ul class="httpRequestsList"><li>abortableGet</li><li>abortablePost</li><li>abortablePut</li><li>abortablePatch</li><li>abortableDelete</li></ul> | Make use of lower level method `abortableRequest` by just overriding the http method ([example](#example&ndash;-abortable-request)) | params | return

### Request params

### Request return

### Abortable request return

### Example &ndash; Abortable request

### Example &ndash; Get request

<br>

## Request hooks

<br>

## Events

<br>

## Caching

<br>

## Browser support
| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| last 2 versions| last 2 versions| last 2 versions| last 2 versions
