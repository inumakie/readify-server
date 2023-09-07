const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;

mongoose.connect(`mongodb+srv://neuralpink:${process.env.MONGODB_PASSWORD}@cluster0.eiebhtt.mongodb.net/?retryWrites=true&w=majority`);
mongoose.connection.once('open', () => {
    console.log('connected to the database');
})
  
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.get("/", (req, res) => {
    const htmlResponse = `
        <html>
            <head>
                <title>Readify server</title>
            </head>
            <body>
                <h1>Readify server</h1>
            </body>
        </html>
    `;

    res.send(htmlResponse);
})

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})