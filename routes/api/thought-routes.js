const router = require("express").Router();
const { Mongoose } = require("mongoose");
const { Thought, Reaction } = require("../../models");

//TODO: ROUTE TO GET ALL THOUGHTS
router.get("/", async (req, res) => {
  const thoughts = await Thought.find({});
  res.json(thoughts);
});

//TODO: ROUTE TO CREATE A NEW THOUGHT
router.post("/", (req, res) => {
  req.body.thoughtText.length > 280
    ? res.json("Thought is too long!")
    : Thought.create(req.body)
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
          console.log(err);
          res.status(400).json(err);
        });
});

//TODO: ROUTE TO GET SINGLE THOUGHT BASED ON THOUGHT ID
router.get("/:thoughtId", (req, res) => {
  Thought.findById(req.params.thoughtId)
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

//TODO: ROUTE TO UPDATE A THOUGHT
router.put("/:thoughtId", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { thoughtText: req.body.thoughtText },
    { new: true },
    (err, result) => {
      if (result) {
        res.status(200).json(result);
        console.log(`Updated: ${result}`);
      } else {
        console.log("Uh Oh, something went wrong");
        res.status(500).json({ message: "something went wrong" });
      }
    }
  );
});

//TODO: ROUTE TO DELETE A THOUGHT BASED ON THOUGHT ID
router.delete("/:thoughtId", (req, res) => {
  Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought with this id!" })
        : User.findOneAndUpdate(
            { username: thought.username },
            { $pull: { thoughts: { _id: req.params.thoughtId } } },
            { runValidators: true, new: true }
          )
    )
    .then((user) =>
      !user
        ? res.status(404).json({ message: "user don't exist" })
        : res.json({ message: "Thought deleted!" })
    )
    .catch((err) => res.status(500).json(err));
});

//TODO: ROUTE TO ADD REACTION TO A THOUGHT
router.post("/:thoughtId/reactions", async (req, res) => {
  const reaction = await Reaction.create(req.body);
  const thought = await Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $push: { reactions: reaction._id } },
    { new: true }
  );
  res.json(thought);
});

//TODO: ROUTE TO DELETE A REACTION ON A THOUGHT
router.delete("/:thoughtId/reactions/:reactionId", (req, res) => {
  Thought.findById(req.params.thoughtId)
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      Reaction.findByIdAndDelete(req.params.reactionId)
        .then((dbReactionData) => {
          if (!dbReactionData) {
            res
              .status(404)
              .json({ message: "No reaction found with this id!" });
            return;
          }
          res.json(dbReactionData);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
