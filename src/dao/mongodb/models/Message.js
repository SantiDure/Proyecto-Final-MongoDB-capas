import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";

const MessageSchema = new Schema({
  _id: { type: String, default: randomUUID },
  user: { type: String, required: true },
  emailUser: { type: String, required: true },
  content: { type: String, required: true },
});

export const messagesManager = model("messages", MessageSchema);
