const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const db = require('./db');
const { expressjwt: expressJwt } = require('express-jwt')
const jwt = require('jsonwebtoken')

const port = process.env.PORT || 9000;
const jwtSecret = "sample_secret"
const app = express();

const fs = require('fs')
const typeDefs = fs.readFileSync('./schema.graphql', { encoding: 'utf-8' })
const resolvers = require('./resolvers')

const { makeExecutableSchema } = require('graphql-tools')
const schema = makeExecutableSchema({ typeDefs, resolvers })

app.use(cors(), bodyParser.json(), expressJwt({
  secret: jwtSecret,
  credentialsRequired: false,
  algorithms: ['sha1', 'RS256', 'HS256']
}));

const { graphiqlExpress, graphqlExpress } = require('apollo-server-express')
app.use('/graphql', graphqlExpress(req => ({
  schema,
  context: { user: req.user && db.students.get(req.user.sub) }
})))
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.post('/login', (req, res) => {
  const { email, password } = req.body

  const user = db.students.list().find((user) => user.email === email)

  if (!(user && user.password === password)) {
    res.setStatus(401)
    return
  }

  const token = jwt.sign({ sub: user.id }, jwtSecret)

  res.send({ token })
})

app.listen(
  port, () => console.info(
    `Server started on port ${port}`
  )
);
