import "reflect-metadata";
import { Action, BadRequestError, useKoaServer } from "routing-controllers";
import setupDb from "./db";
import UserController from "./users/controller";
import LoginController from "./logins/controller";
// import GameController from "./games/controller";
import { verify } from "./jwt";
import User from "./users/entity";

import * as Koa from "koa";
import { Server } from "http";
import * as IO from "socket.io";
import * as socketIoJwtAuth from "socketio-jwt-auth";
import { secret } from "./jwt";

const app = new Koa();
const server = new Server(app.callback());
export const io = IO(server);
const port = process.env.PORT || 4000;

useKoaServer(app, {
  cors: true,
  controllers: [
    UserController,
    LoginController
  ],
  authorizationChecker: (action: Action) => {
    const header: string = action.request.headers.authorization;
    // it has a bearer token than destructure it and split it at the space
    if (header && header.startsWith("Bearer ")) {
      const [, token] = header.split(" ");

      try {
        return !!(token && verify(token));
      } catch (e) {
        throw new BadRequestError(e);
      }
    }
    return false;
  },
  currentUserChecker: async (action: Action) => {
    const header: string = action.request.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const [, token] = header.split(" ");

      if (token) {
        const { id } = verify(token);
        return User.findOneById(id);
      }
    }
    return undefined;
  }
});
