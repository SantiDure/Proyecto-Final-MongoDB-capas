import { messagesManager } from "../dao/mongodb/models/Message.js";

export async function getMessagesController(req, res) {
  let limit = Number(req.query.limit);
  try {
    const data = await messagesManager.find();
    if (!limit) {
      return res.json(data);
    }
    let limitedMessages = data.slice(0, limit);
    return res.json(limitedMessages);
  } catch (error) {
    res.send(404).send({ message: error.message });
  }
}

export async function getMessageControllerId(req, res) {
  const id = req.params.id;
  try {
    const messageForId = await messagesManager.findById(id);
    return res.json({ messageForId });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function postMessageController(req, res) {
  try {
    await messagesManager.create(req.body);
    res.json(req.body);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export async function deleteMessageController(req, res) {
  const { id } = req.params;
  try {
    await productsManager.deleteOne({ _id: id });
    res.json(req.body);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}
