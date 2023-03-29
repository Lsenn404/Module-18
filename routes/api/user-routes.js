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

router.get("/:userId/friends", async (req, res) => {
  const user = await User.findById(req.params.userId);
  const friendsList = user.getFriendsList();
  res.json(friendsList);
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
router.get("/:userId/friends/:friendId", async (req, res) => {
  const friend = await User.findById(req.params.friendId);
  //   console.log(friend, "FRIEND");

  const user = await User.findById(req.params.userId);
  //   console.log(user, "USER");
  if (user.addFriend(friend) === "Friend already exists!") {
    res.json("user already has this friend");
  } else {
    res.json(user);
  }
});

//TODO - ROUTE THAT DELETES A FRIEND FROM A USER'S FRIENDS, DONT DELETE THE FRIEND AS A USER THOUGH!
router.get("/:userId/removefriends/:friendId", async (req, res) => {
  const userId = req.params.userId;
  const friendIdToRemove = req.params.friendId;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: { _id: friendIdToRemove } } },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
