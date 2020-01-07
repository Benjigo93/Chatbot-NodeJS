# Chat bot server

## Description

Implementation of the API server described in https://adrienjoly.com/cours-nodejs/01-chatbot/, for educational purposes.

## Usage

```sh
$ curl http://localhost:3000/ # --> Hello World
$ curl http://localhost:3000/hello # --> Quel est votre nom ?
$ curl http://localhost:3000/hello?nom=Sasha # --> Bonjour, Sasha !
```

## Setup

```
$ git clone https://gitlab.eemi.tech/adrien.joly/node-1-2adev.git
$ npm install
$ npm start
```

## Environment variables

- `PORT` (default: `3000`)
