import { Request, Response } from "express";
import Users from "../models/userModel";
import Blogs from "../models/blogModel";
import ObjectId from 'mongoose';

let ID = ObjectId.Types.ObjectId

const userCtrl = {
  details: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userData = await Users.find({ _id: id }).select('name email _id avatar')
      const blogCount = await Blogs.count({ user:  new ID(id) })
      return res.json({userData, blogCount: blogCount})
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
  blogs: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const blogsData = await Blogs.find({ user: new ID(id) })
      return res.json(blogsData)
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default userCtrl;
