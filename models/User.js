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

userSchema.methods.addFriend = function (friend) {
  this.friends.push(friend);
  return this.save();
};

userSchema.methods.getId = function () {
  return this._id;
};

userSchema.methods.removeFriend = function (friendId) {
  for (let i = 0; i < this.friends.length; i++) {
    if (this.friends[i].getId() === friendId) {
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
