
exports.list = function (req, res, next) {
  res.json([ { "name": "Home" }, { "name": "Messages" }, { "name": "Profile" } ]);
}