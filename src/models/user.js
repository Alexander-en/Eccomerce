import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String
})

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;

/*This line does:

Check if a Mongoose model named User already exists in mongoose.models.
If it does, use that existing model.
If it does not, create a new model with mongoose.model("User", UserSchema) and assign it to User. */