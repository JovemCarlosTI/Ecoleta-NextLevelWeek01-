// Solicitando express
const express = require("express");

// Executando o express
const server = express();

// Pegar banco de dados
const db = require("./database/db")

// Configurar pasta pública
server.use(express.static("public"))

// Habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({extended: true}))


// Usando template engine
const nunjucks = require("nunjucks");

// Configure o nunjucks
// Primeiro argumento: Local dos .html's
// Segundo argumento: Servidor e sem cache
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})


// Configurar caminhos da minha aplicação

// Página inicial
server.get("/", (req, res) => {

  // Envie como resposta
  return res.render("index.html", { title: "Um título"})
})

// Create-point
server.get("/create-point", (req, res) => {

  // req.query: Query Strings da nossa URL
  // console.log(req.query)

  // Envie como resposta
  return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

  // req.body : O corpo do nosso formulário
  // console.log(req.body)

  // Inserir dados no banco de dados
// 2 - Inserir dados na tabela
  const query = `
  INSERT INTO places (
    image,
    name,
    address,
    address2,
    state,
    city,
    items
  ) VALUES (?,?,?,?,?,?,?);
`
const values =  [
req.body.image,
req.body.name,
req.body.address,
req.body.address2,
req.body.state,
req.body.city,
req.body.items
]

  function afterInsertData(err) {
    // Se tiver erro, retorne-o no console
    if(err) {
      return console.log(err)

      return res.send("Erro no cadastro, tente novamente mais tarde!")
    }

    console.log("Cadastro com sucesso")
    console.log(this)

  return res.render("create-point.html", { saved: true })
  }

  db.run(query, values, afterInsertData)

})

// Page-results
server.get("/search", (req, res) => {

  const search = req.query.search

  if(search == "") {
    // Pesquisa vazia
    return res.render("search-results.html", {total: 0})
  }

  // Pegar os dados do banco de dados
    // 3 - Consultar os dados da tabela
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
      if(err) {
        return console.log(err)
      }

      const total = rows.length

      // Mostrar a página .html com os dados do db
      return res.render("search-results.html", {places: rows, total})
    })
})

// Ligar o servidor na porta 3000
server.listen(3000);