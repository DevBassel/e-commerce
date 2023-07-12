import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      min: [2, "name is to low"],
      unique: [true, "this name is exist"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "this email is exist"],
      validate: [
        (val: string) => {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(val);
        },
        "email not valid",
      ],
    },
    password: {
      type: String,
      minlength: [6, "password length shoud be 6 chars"],
      required: [true, "password is required"],
    },
    rule: {
      type: String,
      required: [true, "add your rule"],
    },
  },
  {
    timestamps: true,
  }
);

// hash password before save in database
UserSchema.pre("save", async function (next) {
  try {
    const salt: string = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(String(this.password), salt);
    this.password = hash;

    next();
  } catch (error) {
    console.log(error);
  }
});

const User = mongoose.model("user", UserSchema);

export default User;
