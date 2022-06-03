const db = require("./db")

const Mutation = {
  createStudent: (root, args, context, info) => {
    return db.students.create({
      collegeId: args.id,
      firstName: args.firstName,
      lastName: args.lastName
    })
  },

  addStudent_returns_object: (root, args, context, info) => {
    const id = db.students.create({
      collegeId: args.collegeId,
      firstName: args.firstName,
      lastName: args.lastName
    })

    return db.students.get(id)
  },

  signUp: (root, args, context, input) => {
    const { email, password, firstName } = args.input

    const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const isValidEmail = emailExpression.test(String(email).toLowerCase())

    if (!isValidEmail) throw new Error("Email not in proper format")

    if (firstName.length > 15) throw new Error("Frist name should be less than 15 characters")

    if (password.length < 8) throw new Error("Password should be minimum 8 characters")

    return "Success"
  }
}

const Query = {
  test: () => 'Test Success, GraphQL server is up & running !!',
  students: () => db.students.list(),
  studentById: (root, args, context, info) => db.students.get(args.id),
  sayHello: (root, args, context, info) => `Hi ${args.name} GraphQL server says Hello to you !!`,
  setFavoriteColor: (root, args, context, info) => "Your favorite color is :" + args.color
}

const Student = {
  fullName: (root, args, context, info) => {
    return root.firstName + ":" + root.lastName
  },

  college: (root, args, context, info) => {
    return db.colleges.get(root.collegeId)
  }
}

module.exports = { Query, Student, Mutation }
