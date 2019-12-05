const express = require("express");

const db = require("./db");

const router = express.Router();

router.use(express.json());

//Method POST | endpoint /api/posts | Creates a post using the information sent inside the `request body`.
router.post("/", (req, res) => {
  const body = req.body;
  if (!body.title || !body.contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post." });
  } else {
    db.insert(body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: "There was an error while saving the post to the database."
        });
      });
  }
});

//Method POST | endpoint /api/posts/:id/comments | Creates a comment for the post with the specified id using information sent inside of the `request body`.
router.post("/:id/comments", (req, res) => {
  const body = req.body;
  const id = req.params.id;
  db.findById(id);
  if (!id) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else if (!body.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    db.insertComment(body)
      .then(comment => {
        res.status(201).json({ ...id, ...comment });
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ message: "There was an error saving the comment" });
      });
  }
});

//Method GET | endpoint /api/posts | Returns an array of all the post objects contained in the database.
router.get("/", (req, res) => {
  db.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

//Method GET | endpoint /api/posts/:id | Returns the post object with the specified id.
router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(post => {
      if (post.length !== 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

//Method GET | endpoint /api/posts/:id/comments | Returns an array of all the comment objects associated with the post with the specified id.
router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  db.findPostComments(id)
    .then(post => {
      if (post.length !== 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

//DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The post could not be removed." });
    });
});

//PUT    | /api/posts/:id          | Updates the post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.
router.put("/:id", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post." });
  } else {
    db.update(req.params.id, req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: "There was an error while saving the post to the database."
        });
      });
  }
});

module.exports = router;
