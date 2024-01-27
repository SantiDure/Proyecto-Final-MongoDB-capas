import { Router } from "express";
import { onlySessionActive } from "../middlewares/autorizaciones.js";
import passport from "passport";
import { usersManager } from "../dao/mongodb/models/User.js";
import { encrypt, hashCompare } from "../utils/criptograph.js";
import { COOKIE_OPTS } from "../config.js";
import { appendJwtAsCookie } from "../middlewares/autenticaciones.js";
export const sessionRouter = Router();

sessionRouter.post(
  "/",
  passport.authenticate("loginLocal", {
    failWithError: true,
  }),
  appendJwtAsCookie,

  async (req, res) => {
    console.log(req.user),
      res.status(201).json({ status: "success", user: req.user });
  },
  (error, req, res, next) => {
    res.status(401).json({ status: "error", message: error.message });
  }
);

sessionRouter.get(
  "/current",
  passport.authenticate("jwt", { failWithError: true }),
  function (req, res) {
    return res.json(req.user);
  }
);

sessionRouter.get("/githublogin", passport.authenticate("loginGithub"));

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("loginGithub", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

sessionRouter.get("/githublogin", passport.authenticate("loginGithub"));

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("loginGithub", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

sessionRouter.get("/current", onlySessionActive, (req, res) => {
  res.json(req.user);
});
sessionRouter.delete("/current", async (req, res) => {
  req.session.destroy((err) => {
    res.status(204).json({ message: "logout success" });
  });
});
