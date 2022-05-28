const router = require("express").Router();
const Users = require("../models/UserModel");
const verify = require("./privateRoute");
router.get("/test", verify, async (req, res) => {
  const kur = await Users.findOne({ _id: req.user._id });
  if (kur.name === "vesamatti") {
    res.send(kur);
  } else {
    res.send("nope");
  }
});

module.exports = router;
