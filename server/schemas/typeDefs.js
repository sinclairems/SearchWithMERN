const typeDefs = `
  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
  
  type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  
  type Auth {
    token: ID!
    user: User
  }
  
  type Query {
    users: [User]
    books: [Book]
  }
  `

module.exports = typeDefs;