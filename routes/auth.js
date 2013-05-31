
var passport = require('passport'),
  	LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://localhost/users'),
    Schema = mongoose.Schema,
    usersModel = mongoose.model('users', new Schema({
      username: 'string', password: 'string'
    }));

function findByUsername(username, password, fn) {
  usersModel.findOne({ username: username }, function (err, user) {
    if (err)
      return fn(err, null);
    if (user) {
      if (user._doc.password == password)
        return fn(null, user._doc);
      else
        return fn('Invalid password', null);
    }
    return fn(null, null);
  });
}

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  usersModel.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password'
    },
    function(username, password, done) {
      process.nextTick(function () {
        findByUsername(username, password, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
            return done(null, user);
          })
        });
    }
));

exports.authenticate = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) 
      return res.status(500).json({ error: err });
    if (!user)
      return res.status(401).json({ error: info.message });
    req.logIn(user, function(err) {
      if (err) 
        return res.status(401).json({ error: err });
      
      return res.json({ user: user });
    });
  })(req, res, next);
};

exports.register = function (req, res, next) {
  var user = new usersModel({ username: req.body.userName, password: req.body.password });
  debugger
  user.save(function(err) {
    debugger
    if (err)
      return res.status(500).json({ error: err });
    
    return res.json({ user: user._doc });
  })(req, res, next);
};