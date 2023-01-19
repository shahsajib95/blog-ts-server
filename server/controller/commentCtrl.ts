import { Request, Response } from "express";
import Comments from "../models/commentModel";
import ObjectId from "mongoose";
import { io } from "../index";
import { Pagination } from "../middleware/paginate";

let ID = ObjectId.Types.ObjectId;

// console.log("test")
const commentCtrl = {
  createComment: async (req: Request, res: Response) => {
    try {
      const { content, blog_id, blog_user_id, user } = req.body;

      const newComment = new Comments({
        user: user._id,
        content,
        blog_id,
        blog_user_id,
      });

      const data = {
        ...newComment._doc,
        user,
        createdAt: new Date().toISOString(),
      };
  
      io.to(`${blog_id}`).emit('createComment', data)

      await newComment.save();
      return res.json(newComment);
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
  getComment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { skip, limit } = Pagination(req);
      const data = await Comments.aggregate([
        {
          $facet: {
            totalData:[
              { $match: {
                blog_id: new ID(id),
                comment_root: { $exists: false },
                reply_user: { $exists: false }
              }},
              {
                $lookup: {
                  "from": "users",
                  "let": { user_id: "$user" },
                  "pipeline": [
                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                    { $project: { name: 1, avatar: 1 } }
                  ], 
                  "as": "user"
                }
              },
              { $unwind: "$user" },
              {
                $lookup: {
                  "from": "comments",
                  "let": { cm_id: "$replyCM" },
                  "pipeline": [
                    { $match: { $expr: { $in: ["$_id", "$$cm_id"] } } },
                    {
                      $lookup: {
                        "from": "users",
                        "let": { user_id: "$user" },
                        "pipeline": [
                          { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                          { $project: { name: 1, avatar: 1 } }
                        ], 
                        "as": "user"
                      }
                    },
                    { $unwind: "$user" },
                    {
                      $lookup: {
                        "from": "users",
                        "let": { user_id: "$reply_user" },
                        "pipeline": [
                          { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                          { $project: { name: 1, avatar: 1 } }
                        ], 
                        "as": "reply_user"
                      }
                    },
                    { $unwind: "$reply_user" }
                  ],
                  "as": "replyCM"
                }
              },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit }
            ],
            totalCount: [
              { $match: {
                blog_id: new ID(id),
                comment_root: { $exists: false },
                reply_user: { $exists: false }
              }},
              { $count: 'count' }
            ]
          }
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1
          }
        }
      ])

      const comments = data[0].totalData;
      const count = data[0].count;

      let total = 0;

      if(count % limit === 0){
        total = count / limit;
      }else{
        total = Math.floor(count / limit) + 1;
      }

      return res.json({ comments, total })
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
  replyComment: async (req: Request, res: Response) => {
    try {
      const { 
        user,
        content,
        blog_id,
        blog_user_id,
        comment_root,
        reply_user
      } = req.body


      const newComment = new Comments({ 
        user: user._id,
        content,
        blog_id,
        blog_user_id,
        comment_root,
        reply_user: reply_user._id
      })

      await Comments.findOneAndUpdate({_id: comment_root}, {
        $push: { replyCM: newComment._id }
      })

      const data = {
        ...newComment._doc,
        user: user,
        reply_user: reply_user,
        createdAt: new Date().toISOString()
      }

      io.to(`${blog_id}`).emit('replyComment', data)

      await newComment.save()

      return res.json(newComment)
      
    } catch (err: any) {
      return res.status(500).json({msg: err.message})
    }
  },
};

export default commentCtrl;
