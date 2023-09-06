const graphql = require('graphql');
const Book = require('../models/Book');
const Author = require('../models/Author');

const { GraphQLObjectType,
        GraphQLSchema,
        GraphQLString,
        GraphQLID,
        GraphQLInt,
        GraphQLList,
        GraphQLNonNull } = graphql;

// DATA TYPE DEFINITIONS

const BookType = new GraphQLObjectType({

    name: 'Book',

    fields: () => ({

        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        description: { type: GraphQLString },
        imageUrl: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){
                return Author.findById(parent.authorId);
            }
        }
    })

});

const AuthorType = new GraphQLObjectType({

    name: 'Author',

    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({ authorId: parent.id })
            }
        }
    })

})

// ENTRY POINT ROOT QUERIES

const RootQuery = new GraphQLObjectType({

    name: 'RootQueryType',

    fields: {

        book: {
            type: BookType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args){
                return Book.findById(args.id);
            }
        },

        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({});
            }
        },

        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args){
                return Author.findById(args.id);
            }
        },

        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return Author.find({});
            }
        },
        
    }
});

// MUTATIONS

const Mutation = new GraphQLObjectType({

    name: 'Mutation',

    fields: {

        addAuthor: {

            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name
                });
                return author.save()
            }
        },

        addBook: {

            type: BookType,

            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString)},
                imageUrl: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },

            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    description: args.description,
                    imageUrl: args.imageUrl,
                    authorId: args.authorId
                });

                return book.save();
            }
        },

        deleteBook: {

            type: BookType,

            args: {
                id: { type: new GraphQLNonNull(GraphQLID)}
            },

            resolve(parent, args){
                return Book.findByIdAndDelete(args.id);
            }
            
        }

    }
})
    
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});