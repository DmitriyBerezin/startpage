/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  debugger
  res.json({
  	name: 'Bob'
  });
};
