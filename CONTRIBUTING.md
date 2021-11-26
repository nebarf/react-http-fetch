Contributing
==============================

## **Local setup**

1. [Fork the repo](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
2. Clone the forked repo
  ```sh
  $ git clone git@github.com:YOUR_USERNAME/react-http-fetch.git
  ```
3. Install dependencies
  ```sh
  $ cd react-http-fetch
  $ yarn
  ```
4. Link the local package:
  ```sh
  $ yarn link
  ```
5. Create a sandbox react app:
  ```sh
  $ cd ..
  $ create-react-app react-http-fetch-sandbox
  $ cd react-http-fetch-sandbox
  $ yarn
  ```
6. Link the local library to the sanbox:
  ```sh
  $ yarn link react-http-fetch
  ```
7. Link react peer deps to local library
  ```sh
  $ cd ../react-http-fetch
  $ npm link ../react-http-fetch-sandbox/node_modules/react
  $ npm link ../react-http-fetch-sandbox/node_modules/react-dom
  ```
8. Start library build in watch mode:
  ```sh
  $ yarn build:watch
  ```
9. `In a second terminal window`, start React app:
  ```sh
  $ cd ../react-http-fetch-sandbox
  $ yarn start
  ```

`That's it!` Now you can use the local library in your local sandbox. Any change to library source code should cause it to recompile and the sandbox app to refresh.

## **Test**
Bu sure to cover any changes to the source code by integrating the tests suite.

## **Submit your changes**
Push your changes against your forked repo and make a PR against `nebarf/react-http-fetch:main`.
