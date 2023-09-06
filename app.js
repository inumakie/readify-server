const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());

mongoose.connect(`mongodb+srv://neuralpink:${process.env.MONGODB_PASSWORD}@cluster0.eiebhtt.mongodb.net/?retryWrites=true&w=majority`);
mongoose.connection.once('open', () => {
    console.log('connected to the database');
})
  
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log(`Listening to port 4000`);
})