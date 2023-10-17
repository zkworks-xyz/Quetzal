# Quetzal wallet

This is a [Aztec](https://aztec.network/) Wallet.

## Setup

Dependencies can be installed from the root of the package:

```bash
yarn
```

In addition to the usual javascript dependencies, this project requires `nargo` (package manager) and `noir` (a Domain Specific Language for SNARK proving systems) in addition to `@aztec/aztec-cli`. The former are installed with:

```bash
yarn install:noir
```

To run project you will need Aztec sandbox. It requires [Docker](https://www.docker.com/) to be installed _and running_ locally. To install or update image run:

```bash
yarn install:sandbox
```

## Getting started

After installing dependencies run a local Aztec sandbox in one terminal:

```bash
yarn start:sandbox
```

This will launch a via Docker Compose.


To start a frontend app:
```bash
yarn start:dev
```


At this point, [http://localhost:5173](http://localhost:5173) should provide a minimal smart contract frontend.

