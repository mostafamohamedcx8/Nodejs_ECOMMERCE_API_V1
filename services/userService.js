//module responsible for implementing brand-related services,
// particularly handling HTTP requests related to Brands.
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Factory = require("./handlerFactory");
const createtoken = require("../utils/createtoken");
const { uploadSingleImage } = require("../middleware/uploadimageMiddleware");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
// upload single image
exports.UploadUserImage = uploadSingleImage("imageProfile");

exports.resizeimage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/Users/${filename}`);

    req.body.imageProfile = filename;
  }

  next();
});

// desc get list of Users
// route get /api/v1/Users
// access Private
exports.getUsers = Factory.getAll(User);

// desc get sepific User by id
// route get /api/vi/Users/:id
// access Private
exports.getUser = Factory.getOne(User);

// desc Create User
// route Post /api/vi/Users
// access Private
exports.createUser = Factory.createOne(User);

// desc Update speciface User
// route Put /api/vi/Users/:id
// access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const Document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      imageProfile: req.body.imageProfile,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!Document) {
    return next(new ApiError(`No Document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: Document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const Document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordchangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!Document) {
    return next(new ApiError(`No Document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: Document });
});

// desc delet speciface User
// route Delete /api/vi/Users/:id
// access Private
exports.deletUser = Factory.DeletOne(User);

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.UpdateUserLoggedPassword = asyncHandler(async (req, res, next) => {
  // 1)update user password based on user payload(req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordchangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  // 2)generate token
  const token = createtoken(user._id);
  // 2) return updated user
  res.status(200).json({ data: user, token });
});

exports.UpdateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updateduser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageProfile: req.body.imageProfile,
    },
    { new: true }
  );
  res.status(200).json({ data: updateduser });
});

exports.deletUserLoggedData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).send();
});
