require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatar: string;
  country: string;
  aboutMe: string
  role: string;
  ghanaPost: string;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  resetPasswordToken: string;
  resetPasswordTime: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    phoneNumber: { type: String, trim: true },
    country: { type: String, trim: true },
    aboutMe: { type: String, trim: true },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
    },
    ghanaPost: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//pre-save middleware to hash the password
userSchema.pre(
  "save",
  async function hashPasswordMiddleware(next: (error?: Error) => void) {
    if (!this.isModified("password")) {
      return next();
    }

    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      return next();
    } catch (error: any) {
      return next(error);
    }
  }
);

// sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5h",
  });
};

// compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
