
  if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
    var mongo = {
    "hostname":"localhost",
    "port":27017,
    "username":"",
    "password":"",
    "name":"",
    "db":"users"
    }
}
var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}
var mongourl = generate_mongo_url(mongo);
//var mongourl = "mongodb://localhost/users";

var passport = require('passport'),
  	LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    db = mongoose.connect(mongourl),
    Schema = mongoose.Schema,
    usersModel = mongoose.model('users', { username: String, password: String }),
    bcrypt = require('bcrypt');


function findByUsername(username, password, fn) {
  usersModel.findOne({ username: username }, function (err, user) {
    if (err)
      return fn(err, null);
    if (!user)
      return fn(null, null);

    if (user) {
      bcrypt.compare(password, user._doc.password, function(err, res) {
        if (res)
          return fn(null, user._doc);
        
        return fn('Invalid password', null);
      });    
    }
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
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        if (err)
          throw err;

        var user = new usersModel({ username: req.body.userName, password: hash });
        user.save(function(err) {
          if (err)
            return res.status(500).json({ error: err });
          else {
            req.logIn(user, function (error) {
              if (error)
                throw error;
              
              return res.json({ user: user._doc });
            })
          }
        });
    });
  });
};