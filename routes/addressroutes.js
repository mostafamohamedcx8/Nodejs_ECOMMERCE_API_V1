const express = require("express");
const authService = require("../services/authService");

const {
  addAddressToaddresses,
  removeAddressfromaddresses,
  getloggestuseraddress,
} = require("../services/addressservice");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addAddressToaddresses).get(getloggestuseraddress);

router.delete("/:addressId", removeAddressfromaddresses);

module.exports = router;
