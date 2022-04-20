import mongoose from "mongoose";
import Adapters from "next-auth/adapters";

// Extend the built-in models using class inheritance
export default class User extends Adapters.TypeORM.Models.User.model {
  // You can extend the options in a model but you should not remove the base
  // properties or change the order of the built-in options on the constructor
  constructor(username, password, email, accountType) {
    super(username, password, email, accountType);
  }
}

export const UserSchema = {
  name: "User",
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    username: {
      type: String,
      required: [true, "Please provide a username."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
    },
    email: {
      type: String,
      required: [true, "Please provide an email address."],
      unique: true,
    },
    accountType: {
      type: String,
    },
  },
};

//export default mongoose.models.Accounts || mongoose.model('Accounts', AccountsSchema)
