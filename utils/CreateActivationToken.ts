import jwt, { Secret } from "jsonwebtoken";

interface IActivationToken {
  token: string;
}

const createActivationToken = (user: any): IActivationToken => {
  const token = jwt.sign({ user }, process.env.ACTIVATION_SECRET as Secret, {
    expiresIn: "5m",
  });

  return { token };
};

export default createActivationToken;
