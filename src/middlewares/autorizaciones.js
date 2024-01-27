export function onlySessionActive(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect("/unauthorized");
  }
  next();
}
