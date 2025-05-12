require("dotenv").config();
import { Response } from "express";
import { IUser } from "./../models/user.model";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

//parse environment variables to integrates with fallback values
const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
);

// options for cookies
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() * accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};





const sendToken = (
  user: IUser,
  statusCode: number,
  res: Response,
  options: { [key: string]: any } = {}
) => {
  const accessToken = user.SignAccessToken();

  res.cookie("access_token", accessToken, accessTokenOptions);

  const { _id, email, name, avatar } = user;

  res.status(statusCode).json({
    success: true,
    user: {
      _id,
      email,
      name,
      avatar,
    },
    options,
    accessToken,
  });
};



export { sendToken };
