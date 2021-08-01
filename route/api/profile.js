const express = require("express");
var router = express.Router();
const auth = require("../../middleware/auth");
const {
  check,
  ValidationResult,
  validationResult,
} = require("express-validator");
const User = require("../../models/Users");
const Profile = require("../../models/Profile");
const Posts = require("../../models/Post");
const { json } = require("express");

// get looged in users profile
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "there is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// create and update
router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required").not().isEmpty(),
      check("skills", "skiils is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profilefields = {};
    profilefields.user = req.user.id;
    if (company) profilefields.company = company;
    if (website) profilefields.website = website;
    if (location) profilefields.location = location;
    if (bio) profilefields.bio = bio;
    if (status) profilefields.status = status;
    if (githubusername) profilefields.githubusername = githubusername;
    if (skills) {
      profilefields.skills = skills.split(",").map((skill) => skill.trim());
    }

    profilefields.social = {};
    if (youtube) profilefields.social.youtube = youtube;
    if (twitter) profilefields.social.twitter = twitter;
    if (instagram) profilefields.social.instagram = instagram;
    if (facebook) profilefields.social.facebook = facebook;
    if (linkedin) profilefields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      //update
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profilefields },
          { new: true }
        );
        return res.json(profile);
      }
      //create
      profile = new Profile(profilefields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("server error");
    }
  }
);

//get all profiles
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res.status(400).send("server issue");
  }
});

//get profile by user_id
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "profile not found" });
    }
    res.status(500).send("server error");
  }
});

//Delete a profile and user
router.delete("/", auth, async (req, res) => {
  try {
    await Posts.deleteMany({ user: req.user.id })
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    return res.status(400).send("server issue");
  }
});

//ADD profile experience

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    const { company, title, from, to, location, current, description } =
      req.body;

    const newExp = { company, title, from, to, location, current, description };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(400).json({ msg: "server issue" });
    }
  }
);

// Delete experience

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = await profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// Add education

router.put(
  "/education",
  [
    auth,
    [
      check("school", "school is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    const { degree, school, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      degree,
      school,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(400).json({ msg: "server issue" });
    }
  }
);

// Delete education

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = await profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
