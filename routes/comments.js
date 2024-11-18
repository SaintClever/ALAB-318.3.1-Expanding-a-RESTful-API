const express = require("express");
const router = express.Router();

const comments = require("../data/comments");
const posts = require("../data/posts");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    let links = [
      {
        href: "/comments",
        rel: "",
        type: "GET",
      },
    ];

    res.json({ comments, links });
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.postId && req.body.body) {
      const comment = {
        id: comments[comments.length - 1].id + 1,
        userId: req.body.userId,
        postId: req.body.postId,
        body: req.body.body,
      };

      comments.push(comment);
      res.json(comments[comments.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/postid=:id")
  .get((req, res, next) => {
    let userPost = [];
    let paramsId = parseInt(req.params.id);

    posts.forEach((post) => {
      if (post.userId === paramsId) {
        userPost.push(post);
      }
    });

    const links = [
      {
        href: `/postid=${req.params.id}`,
        rel: "id",
        type: "GET",
      },
    ];

    if (userPost) res.json({ userPost, links });
     else next();
  });

router
  .route("/userid=:id")
  .get((req, res, next) => {
    let userComment = [];
    let paramsId = parseInt(req.params.id);

    comments.forEach((comment) => {
      if (comment.userId === paramsId) {
        userComment.push(comment);
      }
    });

    const links = [
      {
        href: `/userid=${req.params.id}`,
        rel: "id",
        type: "GET",
      },
    ];

    if (userComment) res.json({ userComment, links });
     else next();
  });

  router
  .route("/:id")
  .get((req, res, next) => {
    const comment = comments.find((p) => p.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (comment) res.json({ comment, links });
    else next();
  })
  .patch((req, res, next) => {
    const comment = comments.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          comments[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (comment) res.json(comment);
    else next();
  })
  .delete((req, res, next) => {
    const comment = comments.find((p, i) => {
      if (p.id == req.params.id) {
        comments.splice(i, 1);
        return true;
      }
    });

    if (comment) res.json(comment);
    else next();
  });

module.exports = router;