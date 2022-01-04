<h1 align="center">React http fetch</h1>

<p align="center">
  <img src="assets/img/react-http-fetch-logo.png" alt="react-http-fetch logo"/>
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

## Contents

Just follow links below to get an overview of library features.
- [Contents](#contents)
- [Getting started](#getting-started)
- [Provider](#provider)
- [Http client](#http-client)
  - [Public API](#public-api)
  - [Request params](#request-params)
  - [Request return](#request-return)
  - [Abortable request return](#abortable-request-return)
  - [Example &ndash; Abortable request](#example--abortable-request)
  - [Example &ndash; Get request](#example--get-request)
  - [Example &ndash; Http context](#example--http-context)
- [Request hooks](#request-hooks)
  - [Http request hook params](#http-request-hook-params)
  - [Http request hook return](#http-request-hook-return)
  - [Http request state](#http-request-state)
  - [Example &ndash; Http request hook triggered automatically on component mount](#example--http-request-hook-triggered-automatically-on-component-mount)
  - [Example &ndash; Http request hook triggered manually on component mount](#example--http-request-hook-triggered-manually-on-component-mount)
  - [Example &ndash; Http post request hook](#example--http-post-request-hook)
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
You can override the default configuration used by the http client to perform any request by using the `HttpClientConfigProvider`:

```js
import React from 'react';
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
|cacheStore|The store for cached http responses. By default an in-memory cache store is used.|[HttpInMemoryCacheService](src/cache/http-in-memory-cache.ts)
|cacheStorePrefix|The prefix concatenated to any cached entry.|`rfh`
|cacheStoreSeparator|Separates the store prefix and the cached entry identifier|`__`

<br>

## Http client
The `useHttpClient` hook return a set of methods to perform http requests. The `request` function is the lowest level one, all other exposed functions are just decorators around it. Below a basic example using `request`:

```js
import React from 'react';
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


### Public API

The complete *public API* exposed by the hook:
| Method | Description | Params | Return |
| --------------------- | --------------------------------------------------------------------------| --------------------- | --------------------- | 
|request | The lowest level method to perform a http request | [Request params](#request-params) | [Request return](#request-return)
| <ul class="httpRequestsList"><li>get</li><li>post</li><li>put</li><li>patch</li><li>delete</li></ul> | Make use of lower level method `request` by just overriding the http method ([example](#example--abortable-request)) | [Request params](#request-params) | [Request return](#request-return)
| abortableRequest | The lowest level method to perform an abortable http request ([example](#example--abortable-request)) | [Request params](#request-params) | [Abortable request return](#abortable-request-return)
| <ul class="httpRequestsList"><li>abortableGet</li><li>abortablePost</li><li>abortablePut</li><li>abortablePatch</li><li>abortableDelete</li></ul> | Make use of lower level method `abortableRequest` by just overriding the http method | [Request params](#request-params) | [Abortable request return](#abortable-request-return)

### Request params
| Parameter | Type | Description |
| --------- | ---- | ----------- |
| baseUrlOverride | string | The base url of the request. If provided, it would override the [provider](#provider) base url.
| relativeUrl | string | The url relative to the base one (e.g. posts/1).
| parser | [HttpResponseParser](src/client/types.ts) | An optional response parser that would override the [provider](#provider) global one. |
| context | [HttpContext](src/client/http-context.ts) | An optional context that carries arbitrary user defined data. See examples.|
| requestOptions | [HttpRequestOptions](./src/client/types.ts) | The options carried by the fetch request. |

### Request return
The jsonified return value of native JS fetch. If a custom response parser (see [Provider](#provider)) is provided then the return value corresponds to the parsed one.

### Abortable request return
| Value | Type |
| ----- | ---- |
|[request, abortController]|[[RequestReturn](#request-return), [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)]|

### Example &ndash; Abortable request
```js
import React, { useState, useRef } from 'react';
import { useHttpClient } from 'react-http-fetch';

function App() {
  const { abortableRequest } = useHttpClient();
  const abortCtrlRef = useRef();
  
  const [todo, setTodo] = useState();

  const fetchTodo = async () => {
    const [reqPromise, abortController] = abortableRequest({
      baseUrlOverride: 'https://jsonplaceholder.typicode.com',
      relativeUrl: 'todos/1',
    });
    abortCtrlRef.current = abortController;

    try {
      const res = await reqPromise;
      setTodo(res);
    } catch (error) {
      // Abort the request will cause the request promise to be rejected with the following error:
      // "DOMException: The user aborted a request."
      console.error(error);
    } finally {
      abortCtrlRef.current = undefined;
    }
  };

  const abortPendingRequest = () => {
    if (abortCtrlRef.current) {
      abortCtrlRef.current.abort();
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <div>{`Todo name: ${todo && todo.title}`}</div>
      <button
        style={{ marginRight: '10px' }}
        type="button"
        onClick={fetchTodo}
      >
        Do request
      </button>
      <button
        type="button"
        onClick={abortPendingRequest}
      >
        Abort
      </button>
    </div>
  );
}

export default App;
```

### Example &ndash; Get request
```js
import React, { useState, useEffect } from 'react';
import { useHttpClient } from 'react-http-fetch';


function App() {
  const { get } = useHttpClient();

  const [todo, setTodo] = useState();

  useEffect(
    () => {
      const fetchTodo = async () => {
        const res = await get({
          baseUrlOverride: 'https://jsonplaceholder.typicode.com',
          relativeUrl: 'todos/1',
        });
        setTodo(res);
      };

      fetchTodo();
    },
    [get]
  );

  return (
    <div>{`Todo name: ${todo && todo.title}`}</div>
  );
}

export default App;
```

### Example &ndash; Http context
```js
import React, { useEffect } from 'react';
import {
  useHttpClient,
  useHttpEvent,
  RequestStartedEvent,
  HttpContextToken,
  HttpContext, } from 'react-http-fetch';

const showGlobalLoader = new HttpContextToken(true);
const reqContext = new HttpContext().set(showGlobalLoader, false);

function App() {
  const { request } = useHttpClient();

  useHttpEvent(RequestStartedEvent, (payload) => {
    console.log('Show global loader:', payload.context.get(showGlobalLoader));
  });

  useEffect(
    () => {
      const fetchTodo = async () => {
        await request({
          baseUrlOverride: 'https://jsonplaceholder.typicode.com',
          relativeUrl: 'todos/1',
          context: reqContext,
        });
      };

      fetchTodo();
    },
    [request]
  );

  return (
    <h1>Http Context</h1>
  );
}

export default App;
```

<br>

## Request hooks
The library provides a hook `useHttpRequest` managing the state of the http request. Such state is returned by the hook along with a function to trigger the request. See [params](#http-request-hook-params) and [return](#http-request-hook-return) for more info. A dedicated hook is provided for every http method: `useHttpGet`, `useHttpPost`, `useHttpPatch`, `useHttpPut`, `useHttpDelete`.

### Http request hook params
| Parameter | Type | Description |
| --------- | ---- | ----------- |
| baseUrlOverride | string | The base url of the request. If provided, it would override the [provider](#provider) base url.
| relativeUrl | string | The url relative to the base one (e.g. posts/1).
| parser | [HttpResponseParser](src/client/types.ts) | An optional response parser that would override the [provider](#provider) global one. |
| context | [HttpContext](src/client/http-context.ts) | An optional context that carries arbitrary user defined data. See examples.|
| requestOptions | [HttpRequestOptions](./src/client/types.ts) | The options carried by the fetch request. |
| initialData | any | The value that the state assumes initially before the request is send. |
| fetchOnBootstrap | boolean | Tell if the fetch must be triggered automatically when mounting the component or not. In the second case we would like to have a manual fetch, this is optained by a request function returned by the hook. |

### Http request hook return
Returns an array of two elements, the first one embeds the state of the http request and the second one is a function that can be used to trigger the http request. The table below describes the shape (i.e. properties) of http request state.

### Http request state
| Property | Type | Description |
| --------- | ---- | ----------- |
|  pristine | boolean  | Tells if the request has been dispatched.  |
|  errored  | boolean  | Tells if the request has returned an error. |
|  isLoading  | boolean  | Tells if the request is pending.  |
|  error  | unknown  | property evaluated by the error generated by the backend api.  |
|  data  | any  | The response provided by the backend api.  |

### Example &ndash; Http request hook triggered automatically on component mount
```js
import React from 'react';
import { useHttpRequest } from 'react-http-fetch';

function App() {
  const [state] = useHttpRequest({
    baseUrlOverride: 'https://jsonplaceholder.typicode.com',
    relativeUrl: 'todos/1',
    requestOptions: {},
    initialData: {},
    fetchOnBootstrap: true,
  });

  return (
    <div>{`Todo name: ${state && state.data && state.data.title}`}</div>
  );
}

export default App;
```

<br>

### Example &ndash; Http request hook triggered manually on component mount
```js
import { useHttpRequest } from 'react-http-fetch';
import React, { useEffect } from 'react';

function App() {
  const [state, request] = useHttpRequest({
    baseUrlOverride: 'https://jsonplaceholder.typicode.com',
    relativeUrl: 'todos/1',
  });

  useEffect(() => request(), [request]);

  return (
    <div>{`Todo name: ${state && state.data && state.data.title}`}</div>
  );
}

export default App;
```

### Example &ndash; Http post request hook

```js
import React, { useState } from 'react';
import { useHttpPost } from 'react-http-fetch';

function App() {
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const [, createPostRequest] = useHttpPost({
    baseUrlOverride: 'https://jsonplaceholder.typicode.com',
    relativeUrl: 'posts',
  });

  const createPost = async (event) => {
    event.preventDefault();
    const { postTitle, postBody } = inputs;

    const reqBody = { title: postTitle, body: postBody };
    try {
      // Providing request options when running the request.
      // Provided options will be merged to the one provided
      // to the hook useHttpPost.
      await createPostRequest({
        requestOptions: { body: reqBody }
      });
      alert('Post created!');
    } catch (error) {
      console.error(error);
      alert('An error occured. Check the browser console.');
    }
  };

  return (
    <form onSubmit={createPost}>
      <label style={{ display: 'block' }}>
        Title:
        <input
          type="text"
          name="postTitle"
          value={inputs.postTitle || ""}
          onChange={handleChange}
        />
      </label>
      <label style={{ display: 'block' }}>
        Body:
        <input
          type="text"
          name="postBody"
          value={inputs.postBody || ""}
          onChange={handleChange}
        />
      </label>
      <button type="submit">
        Create Post
      </button>
    </form>
  );
}

export default App;
```


<br>

## Events
Every time a request is executed the events shown below will be emitted. Each event carries a specific payload.

| Event type | Payload type |
| --------- | ---- |
| [RequestStartedEvent](src/events-manager/events/request-started-event.ts) | [HttpRequest](src/client/http-request.ts)  |
|  [RequestErroredEvent](src/events-manager/events/request-errored-event.ts)  | [HttpError](src/errors/http-error.ts) |
|  [RequestSuccededEvent](src/events-manager/events/request-succeded-event.ts)  |[RequestSuccededEventPayload](src/events-manager/events/request-succeded-event.ts)  |

You can subscribe a specific event using the [useHttpEvent](src/events-manager/use-http-event.ts) hook as shown below:

```js
import { useState } from 'react';
import { RequestErroredEvent, RequestStartedEvent, RequestSuccededEvent, useHttpEvent, useHttpRequest } from 'react-http-fetch';

function App() {
  const [count, setCount] = useState(0);

  const [, request] = useHttpRequest({
    baseUrlOverride: 'https://jsonplaceholder.typicode.com',
    relativeUrl: 'todos/1',
  });

  useHttpEvent(RequestStartedEvent, () => setCount(count + 1));
  useHttpEvent(RequestSuccededEvent, () => setCount(count > 0 ? count - 1 : 0));
  useHttpEvent(RequestErroredEvent, () => setCount(count > 0 ? count - 1 : 0));

  return (
    <>
      <button onClick={request}>{'increment count:'}</button>
      <span>{count}</span>
    </>
  );
}

export default App;
```

<br>

## Caching
Any request can be cached by setting the `maxAge` (expressed in milliseconds) parameter as part of the request options as shown below:

```js
import { useHttpRequest } from 'react-http-fetch';
import React from 'react';

function App() {
  const [state, request] = useHttpRequest({
    baseUrlOverride: 'https://jsonplaceholder.typicode.com',
    relativeUrl: 'todos/1',
    requestOptions: { maxAge: 60000 } // Cache for 1 minute
  });

  const fetchTodo = () => {
    const { reqResult } = request();
    reqResult.then(res => console.log(res))
  };

  return (
    <>
      <div>
        {`Todo name: ${(state && state.data && state.data.title) || ''}`}
      </div>
      <button type="button" onClick={fetchTodo}>
        Make request
      </button>
    </>
  );
}

export default App;
```

By default the http client uses an in-memory cache, so it will be flushed everytime a full app refresh is performed. You can override the default caching strategy by providing your own cache store. The example below shows a http cache store based on session storage:

```js
import React from 'react';
import { useHttpRequest, HttpClientConfigProvider } from 'react-http-fetch';

export class HttpSessionStorageCacheStore {
  /**
   * The local cache providing for a request identifier
   * the corresponding cached entry.
   */
  _store = window.sessionStorage;

  /**
   * @inheritdoc
   */
  get(identifier) {
    const stringifiedEntry = this._store.getItem(identifier);
    if (!stringifiedEntry) {
      return;
    }

    try {
      const parsedEntry = JSON.parse(stringifiedEntry);
      return parsedEntry;
    } catch (err) {
      return;
    }
  }

  /**
   * @inheritdoc
   */
  put(identifier, entry) {
    try {
      const stringifiedEntry = JSON.stringify(entry);
      this._store.setItem(identifier, stringifiedEntry);

      return () => this.delete(identifier);
    } catch (err) {
      return () => {};
    }
  }

  /**
   * @inheritdoc
   */
  has(identifier) {
    return this._store.has(identifier);
  }

  /**
   * @inheritdoc
   */
  delete(identifier) {
    this._store.removeItem(identifier);
  }

  /**
   * Gets all entry keys.
   */
  _keys() {
    return Object.keys(this._store);
  }

  /**
   * Gets all stored entries.
   */
  entries() {
    return this._keys()
      .map(entryKey => this._store.getItem(entryKey));
  }

  /**
   * @inheritdoc
   */
  flush() {
    this._keys().forEach((itemKey) => {
      this.delete(itemKey);
    });
  }
}

const httpCacheStore = new HttpSessionStorageCacheStore();

function Child() {
  const [state, request] = useHttpRequest({
    baseUrlOverride: 'https://jsonplaceholder.typicode.com',
    relativeUrl: 'todos/1',
    requestOptions: { maxAge: 60000 } // Cache for 1 minute
  });

  console.log('Request state:', state.data);

  const fetchTodo = () => {
    const { reqResult } = request();
    reqResult.then(res => console.log('Request response: ', res))
  };

  return (
    <>
      <div>
        {`Todo name: ${(state && state.data && state.data.title) || ''}`}
      </div>
      <button type="button" onClick={fetchTodo}>
        Make request
      </button>
    </>
  );
};


function App() {
  const httpReqConfig = {
    cacheStore: httpCacheStore,
    // "prefix" and "separator" are not mandatory,
    // if not provided the default ones will be used.
    cacheStorePrefix: 'customPrefix',
    cacheStoreSeparator: '-'
  };

  return (
    <HttpClientConfigProvider config={httpReqConfig}>
      <Child />
    </HttpClientConfigProvider>
  );
}

export default App;
```

<br>

## Browser support
| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| last 2 versions| last 2 versions| last 2 versions| last 2 versions
