import { usersDaoMongoose } from "../dao/user.dao.mongoose.js";

class UserService {
  async createUserService(data) {
    const user = await usersDaoMongoose.create(data);
    return user;
  }

  async getUsersService() {
    return await usersDaoMongoose.readMany({});
  }

  async getUserByIdService(quey) {
    const userForId = await usersDaoMongoose.readOne(quey);
    return userForId;
  }

  async updateOneService(id, data) {
    return usersDaoMongoose.updateOne(id, data);
  }

  async delteOneService(id) {
    return usersDaoMongoose.deleteOne(id);
  }
}

export const userService = new UserService();
