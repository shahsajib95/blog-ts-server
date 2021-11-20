import { Request, Response } from "express";
import Users from "../models/userModel";
import Blogs from "../models/blogModel";
import { base64 } from "../middleware/imageToBase64";
import ObjectId from "mongoose";

let ID = ObjectId.Types.ObjectId;

const userCtrl = {
  details: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userData = await Users.find({ _id: id }).select(
        "name email _id avatar"
      );
      const blogCount = await Blogs.count({ user: new ID(id) });
      return res.json({ userData, blogCount: blogCount });
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
  patch: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { email, name } = req.body;
      const user = await Users.find({ _id: id });
      if (!user) return res.json({ err: "No Account found" });
      const find = await Users.find({
        email: email,
        $in: new ID(id),
      });
      if (!find) return res.json({ err: "Email already exits" });
      const userData = await Users.updateOne(
        { _id: new ID(id) },
        { email: email, name: name },
        { upsert: true }
      );
      return res.json(userData);
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
  avatar: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await Users.find({ _id: id });
      if (!user) return res.json({ err: "No Account found" });

      const file = req.files?.file;

      await base64(file)
        .then(async (newFileInfo: any) => {
          // newFileInfo holds the output file properties
          const buf = await Buffer.from(newFileInfo, "base64");
          const finalImg = await buf.toString("base64");
          const userData = await Users.updateOne(
            { _id: new ID(id) },
            { avatar: finalImg },
            { upsert: true }
          );
          return res.json(userData);
        })
        .catch(function (err: any) {
          return res.status(500).json({ err: "Can not upload image" });
        });

    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
  blogs: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const blogsData = await Blogs.find({ user: new ID(id) }).select('-thumbnail').sort({ _id: -1 });
      if (!blogsData) return res.json({ err: "No Blog Found" });
      return res.json(blogsData);
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default userCtrl;
