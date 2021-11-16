import { Request, Response, NextFunction } from "express";
import { IDecodedToken } from "./interface";
import jwt from "jsonwebtoken";
import Users from "../models/userModel";

export const auth = async (req: Request, res: Response,  next: NextFunction) =>{
    const token = req.headers.authorization;

    if (!token)
      return res.status(201).json({ err: "Please login now! No Cookies" });

    const result = await (<IDecodedToken>(
      jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
    ));
    if (!result.id)
      return res
        .status(201)
        .json({ err: "Please login now! Cookies different error" });

    const user = await Users.findById(result.id).select("-password");
    if (!user)
      return res.status(201).json({ err: "This account does not exist." });
   next()
}