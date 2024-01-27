import { Router } from "express";
import { usersManager } from "../dao/mongodb/models/User.js";
import { encrypt, hashear } from "../utils/criptograph.js";
import { authenticate } from "../middlewares/autenticaciones.js";
import { COOKIE_OPTS } from "../config.js";
import { getTokenFromCookie } from "../middlewares/tokens.js";
import { onlySessionActive } from "../middlewares/autorizaciones.js";
import passport from "passport";

export const usersRouter = Router();

usersRouter.post("/", async (req, res) => {
  try {
    req.body.password = hashear(req.body.password);
    const user = await usersManager.create(req.body);

    res.status(201).json({
      status: "success",
      payload: user.toObject(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

usersRouter.get("/current", (req, res) => {
  //debe comprobar que existe un token para devolver la informacion del usuario
  passport.authenticate("jwt", { failWithError: true }),
    async (req, res) => {
      res.json({ status: "success", payload: req.user });
    };
});

usersRouter.put("/", async function (req, res) {
  try {
    if (req.body.password) {
      req.body.password = hashear(req.body.password);
    }

    const updated = await usersManager.findOneAndUpdate(
      { email: req.body.email },
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ status: "error", message: "usuario no encontrado" });
    }

    res.json({ status: "success", payload: updated });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});
