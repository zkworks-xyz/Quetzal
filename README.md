# Quetzal
Quetzal is an [Aztec](https://aztec.network/) wallet, supporting public and private transactions.

It is in early stage of development, with more features to come.

## Contributing

### Install dependencies

Make sure you install the prerequisites:
1. [Node.js](https://nodejs.org/en) version 20 or later
2. [Yarn](https://yarnpkg.com/) version 3 or later
3. [Docker](https://www.docker.com/)

Next, to install dependencies, use the following command:
```bash
yarn
```

In addition to the usual javascript dependencies, the project requires `nargo` package manager and `noir` language.
To install them, use following command:

```bash
yarn install:noir
```

To run the project, you will need Aztec sandbox, which runs as docker containers.
Make sure you have [Docker](https://www.docker.com/) installed and _and running_ locally.
To install or update docker images, run:

```bash
yarn install:sandbox
```

## Getting started

To start the local environment, launch Aztec sandbox in one terminal:

```bash
yarn start:sandbox
```

Next, to start a frontend app, in a seperate terminal, use the following command:

```bash
yarn start:dev
```

To interact with the app, navigate to [http://localhost:5173](http://localhost:5173).

## Testing

To run integration tests, make sure Aztec sandbox is running.
Then, type the following command in a terminal:

```bash
yarn test:integration
```


## Upgrading environment

Updating environment checklist
- in `package.json` update `install:noir` script, to look something like this:
```sh
"curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash noirup -v 0.xx.x-aztec.x",
```
noirup -v X.X.X-aztec.X`
- in `package.json` update `install:sandbox` script to look like something like this:
```
"docker pull aztecprotocol/aztec-sandbox:0.xx.x",
```
- update @aztec/cli to list with following command:
```sh
npm install -g @aztec/cli
```

- in `package.json` update following dependencies:
```json
    "@aztec/aztec.js": "^0.xx.x",
    "@aztec/circuits.js": "^0.xx.x",
    "@aztec/foundation": "^0.xx.x",
    "@aztec/noir-contracts": "^0.xx.x",
    "@aztec/types": "^0.xx.x",
```
- update noir
```sh
yarn install:noir
```
- update sandbox
```sh
yarn install:sandbox
```
- update dependencies
```sh
yarn
```
- compile contracts with following command, it might take longer than usual
```sh
yarn compile
```

