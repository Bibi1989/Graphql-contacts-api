const graphql = require("graphql");
// import graphql from 'graphql'
import _ from "lodash";
import {
  postUser,
  postContact,
  getAllContacts,
  getContactsByUserId
} from "../controller/contacts";
import { User, Contacts } from "../controller/contacts";
import { Auth } from "../controller/auth";
import { NextFunction } from "express";
// import jwt from 'jsonwebtoken'

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLSchema
} = graphql;

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
      resolve: (parent: User) => {
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
      resolve: (parent: any, args: User, { req, res }: any) => {
        return postUser(args, req, res);
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
      resolve: (_parent: Contacts, args: Contacts, { req, res, next }: any) => {
        Auth(req, res, next);
        return postContact(req, res, args);
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
      resolve(_parent: any, _args: User) {}
    },
    contacts: {
      type: GraphQLList(ContactType),
      description: "Query books",
      resolve(parent: Contacts, args: any) {
        return getAllContacts();
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
