import { Request, Response } from "express";
import Likes from "../models/likeModel";
import Blogs from "../models/blogModel";
import ObjectId from "mongoose";

let ID = ObjectId.Types.ObjectId;

export const likeCtrl = {
  post: async (req: Request, res: Response) => {
    try {
      const { blogId, likedUser } = req.body;

      const likeData = new Likes({ blogId, likedUser });
      const result = await likeData.save();
      const likeUpdate = await Blogs.updateOne(
        { _id: blogId },
        { $inc: { love: 1 } }
      );
      return res.json(likeUpdate);
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ err: err.message });
    }
  },
  unlike: async (req: Request, res: Response) => {
    const { id, blogId } = req.params;
    const deleteLike = await Likes.findOneAndRemove({ _id: id });
    const likeUpdate = await Blogs.updateOne(
      { _id: blogId },
      { $inc: { love: -1 } }
    );
    return res.json({ like: false, data: likeUpdate });
  },
  get: async (req: Request, res: Response) => {
    const { id } = req.params;
    const like = await Likes.find({ likedUser: new ID(id) });
    if (!like) return res.json({ like: false });
    res.json(like);
  },
};
