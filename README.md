# Chat bot server

## Description

Implementation of the API server described in https://adrienjoly.com/cours-nodejs/01-chatbot/, for educational purposes.

## Usage

```sh
$ curl http://localhost:3000/ # --> Hello World
$ curl http://localhost:3000/hello # --> Quel est votre nom ?
$ curl http://localhost:3000/hello?nom=Sasha # --> Bonjour, Sasha !
$ curl -X POST --header "Content-Type: application/json" --data "{\"msg\":\"ville\"}" http://localhost:3000/chat # --> Nous sommes à Paris
$ curl -X POST --header "Content-Type: application/json" --data "{\"msg\":\"météo\"}" http://localhost:3000/chat # --> Il fait beau

# Depend on the content of the 'reponses.json' file
# If you even reload the server, you can get the information if it is correctly stored in the 'reponses.json' file =>

# If 'demain' is not defined in 'reponses.json' file :
$ curl -X POST --header "Content-Type: application/json" --data "{\"msg\":\"demain\"}" http://localhost:3000/chat # --> Je ne connais pas demain…
# If you want to define 'demain' in 'reponses.json' file :
$ curl -X POST --header "Content-Type: application/json" --data "{\"msg\":\"demain = Mercredi\"}" http://localhost:3000/chat # --> Merci pour cette information !
# If 'demain' is defined in 'reponses.json' file : 
$ curl -X POST --header "Content-Type: application/json" --data "{\"msg\":\"demain\"}" http://localhost:3000/chat # --> demain: Mercredi


```

## Setup

```
$ git clone https://github.com/Benjigo93/chatbot.git
$ npm install
$ npm start
```

## Environment variables

- `PORT` (default: `3000`)
