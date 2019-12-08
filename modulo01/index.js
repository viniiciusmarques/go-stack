const express = require("express");

const server = express();

server.use(express.json());

const users = ["Diego", "Robson", "Victor"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is require" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
}

// Lista todos usuários
// localhost:3000/users
server.get("/users", (req, res) => {
  return res.json(users);
});

// Lista um usuário específico
// localhost:3000/users/{index_user}
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

// Adiciona um usuário
// localhost:3000/users
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Atualiza um usuário
// localhost:3000/users
server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// Deleta um usuário
// localhost:3000/users
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
