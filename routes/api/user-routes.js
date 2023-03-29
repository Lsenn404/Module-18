const router = require("express").Router();
const { User } = require("../../models");

//TODO - ROUTE THAT GETS ALL THE USERS, include friends?
router.get("/", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//TODO - ROUTE THAT CREATES A NEW USER
router.post("/", (req, res) => {
  User.create(req.body)
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

//TODO - ROUTE THAT GETS A SINGLE USER BASED ON USER ID
router.get("/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user);
});

//TODO - ROUTE THAT UPDATES A SINGLE USER
router.put("/:userId", async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate();
});

//TODO - ROUTE THAT DELETES A SINGLE USER BASED ON USER ID
router.delete("/:userId", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    res.json(deletedUser);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//TODO - ROUTE THAT ADDS A FRIEND TO A USER
router.put("/:userId/friends/:friendId", async (req, res) => {
  const friend = await User.findById(req.params.friendId);
  const user = await User.findById(req.params.userId);
  user.addFriend.push(friend);
});

//TODO - ROUTE THAT DELETES A FRIEND FROM A USER'S FRIENDS, DONT DELETE THE FRIEND AS A USER THOUGH!
router.delete("/:userId/friends/:friendId", (req, res) => {});

module.exports = router;
