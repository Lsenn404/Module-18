const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+..+/, "Must match an email address!"],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.methods.getId = function () {
  return this._id;
};

userSchema.methods.getFriendsList = function () {
  return this.friends;
};

userSchema.methods.addFriend = function (friend) {
  const friendsList = this.getFriendsList();
  console.log(friendsList, "FRIENDSLIST");
  if (friendsList.includes(friend.getId())) {
    return "Friend already exists!";
  }
  this.friends.push(friend);
  return this.save();
};

userSchema.methods.removeFriend = function (friend) {
  const friendsList = this.getFriendsList();
  console.log(friend, "LOGGING FRIEND")
  for (let i = 0; i < friendsList.length; i++) {
    if (friendsList[i] === friend) {
      this.friends.splice(i, 1);
      return this.save();
    }
  }
};

userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("User", userSchema);

module.exports = User;
