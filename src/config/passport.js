const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User'); 

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  // Usuario de correos electr�nicos coincidentes
  const user = await User.findOne({email: email});
  if (!user) {
    return done(null, false, { message: 'Usuario no encontrado.' });
  } else {
    //Usuario de contrase�a de coincidencia
    const match = await user.matchPassword(password);
    if(match) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Contrase�a incorrecta.' });
    }
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
