import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/userModel";
import { generateAccessToken } from "../config/generateToken";
import { IDecodedToken } from "../middleware/interface";

const authCtrl = {
  login: async(req: Request, res: Response) =>{
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email: email });
      if (!user) return res.status(201).json({ err: "Account does not exist" });

      const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch) return res.status(201).json({ err: 'Password does not match' });
      
      const token = generateAccessToken({ id: user._id });

      return res.json({ ...user._doc, token });
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ err: err.message });
    }
  },
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const user = await Users.findOne({ email: email });
      if (user) return res.status(201).json({ err: "Email already exists." });

      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = { name, email, password: passwordHash };

      const new_user = new Users(newUser);
      await new_user.save();
      const token = generateAccessToken({ id: new_user._id });
      return res.json({ ...new_user._doc, token });
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ err: err.message });
    }
  },
  accessToken: async (req: Request, res: Response) => {
    const token = req.headers.authorization
    if (!token) return res.status(201).json({ err: "Please login now! No Cookies" });

    const result = await <IDecodedToken>jwt.verify(token, `${process.env.REFRESH_TOKEN_SECRET}`);
    if (!result.id) return res.status(201).json({ err: "Please login now! Cookies different error" });

    const user = await Users.findById(result.id).select("-password");
    if (!user)
    return res.status(201).json({ err: "This account does not exist." });
    res.status(201).json(user);
  },
};

export default authCtrl;
