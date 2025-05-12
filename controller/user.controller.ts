import fs from "fs";
require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import sendMail from "../utils/SendMail";
import createActivationToken from "../utils/CreateActivationToken";
import { sendToken } from "../utils/jwt";

interface IRegistrationBody {
  name: string;
  email: string;
  country: string;
  aboutMe: string;
  phoneNumber: string;
  password: string;
  avatar?: string;
}

// user account registration
export const UserRegistration = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, country, aboutMe, phoneNumber, password } = req.body;

      if (!req.file) {
        return next(new ErrorHandler("Select image file to proceed", 400));
      }

      const avatar = req.file.filename;

      const isEmailExist = await UserModel.findOne({ email });
      if (isEmailExist) {
        const filename = req.file && req.file.filename;
        const filePath = `uploads/${filename}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Error deleting file" });
          }
        });
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
        country,
        aboutMe,
        phoneNumber,
        avatar,
      };

      const activationToken = createActivationToken(user);

      const activationUrl = `http://localhost:9098/activation/${activationToken.token}`;

      const data = { user: { name: user.name }, activationUrl };

      const encodedToken = encodeURIComponent(
        activationToken.token.replace(/\./g, "%2E")
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation_mail.ejs",
          data,
        });
        // await UserModel.create(user);
        res.status(201).json({
          success: true,
          message: `Please check your email ${user.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        console.log("Send Mail Error:", error); // Log the entire error for better debugging
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      console.log("error 3", error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//user account activation
interface IActivationRequest {
  activation_token: string;
}

export const UserActivation = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token } = req.body as IActivationRequest;

      console.log("activation_token",activation_token)

      const newUser: { user: IUser; activationToken: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationToken: string };

      console.log("newUser", newUser);

      if (!newUser) {
        return next(new ErrorHandler("Invalid activation token", 400));
      }

      const { name, email, password,  country,
        aboutMe,
        phoneNumber,
        avatar, } = newUser.user;

      const isEmailExist = await UserModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      // const user = await UserModel.create({ name, email, password });

      const user: any = {
        name,
        email,
        password,
        country,
        aboutMe,
        phoneNumber,
        avatar,
      };

      await UserModel.create(user);

      sendToken(user, 201, res);
      res
        .status(201)
        .json({ success: true, message: "Account activated successfully" });
    } catch (error: any) {
      console.log("error occurred",error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const UserLogin = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter your email and password", 400)
        );
      }

      const user = await UserModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Incorrect email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Incorrect email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//load user
export const LoadUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.findById(req.user?._id);
      // console.log(user);
      if (!user) {
        return next(
          new ErrorHandler(
            "Your session has timed out. Log in again to continue",
            400
          )
        );
      }

      res.status(200).json({ success: true, user });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//social auth
interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}
export const socialAuth = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await UserModel.findOne({ email });
      if (!user) {
        const newUser = await UserModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//logout user
export const UserLogout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      console.log(req.user);

      res.status(200).json({
        success: true,
        message: "Logout successful!",
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user
export const updateUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, phoneNumber, country, aboutMe, name } = req.body;

      const user = await UserModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;
      user.country = country;
      user.aboutMe = aboutMe;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update the user avatar
export const updateUserAvatar = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existsUser = await UserModel.findById(req.user?._id);

      if (!existsUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Check if the avatar exists and if it's stored locally
      const existAvatarPath = existsUser?.avatar
        ? `uploads/${existsUser.avatar}`
        : null;

      if (existAvatarPath && fs.existsSync(existAvatarPath)) {
        // If the avatar exists and is stored locally, unlink it
        fs.unlinkSync(existAvatarPath);
      }

      if (!req.file) {
        return next(new ErrorHandler("Select image file to proceed", 400));
      }

      const fileUrl = req.file.filename;

      const user = await UserModel.findByIdAndUpdate(req.user?.id, {
        avatar: fileUrl,
      });

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.error(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user addressed
export const updateUserAddresses = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = await UserModel.findById(req.user?._id);
      const sameTypeAddress = user?.addresses?.find(
        (address: any) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(
            `${req.body.addressType} address already exists`,
            400
          )
        );
      }

      const existsAddress = user?.addresses.find(
        (address: any) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user?.addresses?.push(req.body);
      }

      await user?.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.error(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//delete user addressed
export const deleteUserAddress = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const addressId = req.params.id;

      console.log(addressId);

      await UserModel.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await UserModel.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error: any) {
      console.error(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update the user password
export const updateUserPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.findById(req.user?._id).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error: any) {
      console.error(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// find user information with the userId
export const getUserInfoById = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.error(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// all users --- for admin
export const getAllUsersByAdmin = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("fetching users");
      const users = await UserModel.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error: any) {
      console.error(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// all users --- for admin
export const deleteUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }

      await UserModel.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error: any) {
      console.error(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
