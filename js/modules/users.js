
class User {
  static #takenNames = []
  // static #rooms = []

  static isNameTaken(name) {
      return User.#takenNames.includes(name)
  }

  constructor(name, id, rooms = []) {
      this.name = name
      this.id = id
      this.rooms = rooms
      User.#takenNames.push(name)
  } 
}

module.exports =  User;