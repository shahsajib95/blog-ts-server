import { Request, Response } from "express";
import { base64 } from "../middleware/imageToBase64";
import { Pagination } from "../middleware/paginate";
import Blogs from "../models/blogModel";
import Likes from "../models/likeModel";
import ObjectId from "mongoose";

let ID = ObjectId.Types.ObjectId;

const blogCtrl = {
  post: async (req: Request, res: Response) => {
    try {
      const { title, body, user, tags } = req.body;
      const file = req.files?.file;
      await base64(file)
        .then(async (newFileInfo: any) => {
          // newFileInfo holds the output file properties
          const buf = await Buffer.from(newFileInfo, "base64");
          const finalImg = await buf.toString("base64");
          const blog = new Blogs({
            title,
            body,
            thumbnail: finalImg,
            user,
            tags,
          });
          const result = await blog.save();
          return res.json(result);
        })
        .catch(function (err: any) {
          return res.status(500).json({ err: "Can not upload image" });
        });
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ err: err.message });
    }
  },
  details: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const blog = await Blogs.find({ _id: id }).populate(
        "user",
        "_id name avatar"
      );
      return res.json(blog);
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ err: err.message });
    }
  },
  get: async (req: Request, res: Response) => {
    try {
      const {type} = req.params
      if(type === 'recent'){
        getRecentBlog(req, res)
      }else if (type === 'popular'){
        getPopularBlog(req, res)
      }
     
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ err: err.message });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleteBlog = await Blogs.findOneAndRemove({ _id: id });
      const likeData = await Likes.findOneAndRemove({ blogId: new ID(id) });
      console.log(likeData);
      return res.json(deleteBlog);
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ err: err.message });
    }
  },
};

const getRecentBlog = async (req: Request, res: Response)=>{
  const { skip, limit } = Pagination(req);

  const count = await Blogs.count({});
  const blog = await Blogs.find({})
    .skip(skip)
    .limit(limit)
    .sort({ _id: -1 })
    .populate("user", "_id name avatar");

  return res.json({ blog, count });
}
const getPopularBlog = async (req: Request, res: Response)=>{
  const { skip, limit } = Pagination(req);

  const count = await Blogs.count({});
  const blog = await Blogs.find({})
    .skip(skip)
    .limit(limit)
    .sort({ love: -1 })
    .populate("user", "_id name avatar");

  return res.json({ blog, count });
}

export default blogCtrl;
