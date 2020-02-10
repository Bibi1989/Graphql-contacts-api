"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql = require("graphql");
const contacts_1 = require("../controller/contacts");
const auth_1 = require("../controller/auth");
// import jwt from 'jsonwebtoken'
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema } = graphql;
const UserType = new GraphQLObjectType({
    name: "User",
    description: "Users Registration",
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        contacts: {
            type: ContactType,
            resolve: (parent) => {
                // return getContactsByUserId(parent.id);
            }
        }
    })
});
const ContactType = new GraphQLObjectType({
    name: "Contact",
    description: "List of books",
    fields: () => ({
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        company: { type: GraphQLString }
    })
});
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    description: "Adding Users to database",
    fields: {
        addUser: {
            type: UserType,
            args: {
                username: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve: (parent, args, { req, res }) => {
                return contacts_1.postUser(args, req, res);
            }
        },
        addContact: {
            type: ContactType,
            args: {
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
                company: { type: GraphQLString }
            },
            resolve: (_parent, args, { req, res, next }) => {
                auth_1.Auth(req, res, next);
                return contacts_1.postContact(req, res, args);
            }
        }
    }
});
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    description: "Root of my queries",
    fields: {
        user: {
            type: GraphQLList(UserType),
            description: "Query books",
            resolve(_parent, _args) { }
        },
        contacts: {
            type: GraphQLList(ContactType),
            description: "Query books",
            resolve(parent, args) {
                return contacts_1.getAllContacts();
            }
        }
    }
});
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
module.exports = schema;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMzg1NDBhLTFhMjYtNDk3Zi05YzY5LTc3YjMyYmQxNzA4NCIsImlhdCI6MTU4MTMzODgyMn0.YeCGiGVEP28LvxueWETSzNKco03bYOtCabckUB5-H1I
//# sourceMappingURL=schema.js.map