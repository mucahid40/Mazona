import {
  JsonController,
  Post,
  Param,
  Get,
  Body,
  Authorized
} from "routing-controllers";
import User from "./entity";
import { io } from "../index";

@JsonController()
export default class UserController {
  //this handles the signup
  @Post("/users")
  async signup(@Body() data: User) {
    const { password, ...rest } = data;
    const entity = User.create(rest);
    await entity.setPassword(password);

    //it saves entity to database
    const user = await entity.save();

    //it emits and action to the store in front-end
    //to add the latest changes to the webpage
    io.emit("action", {
      type: "ADD_USER",
      payload: entity
    });

    return user;
  }

  //get single user by id
  @Authorized()
  @Get("/users/:id([0-9]+)")
  getUser(@Param("id") id: number) {
    return User.findOne(id);
  }

  //get every user
  @Authorized()
  @Get("/users")
  allUsers() {
    return User.find();
  }
}
