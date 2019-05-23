import { ResolverMap } from "../../types/types.common";
import User from "../../entity/User";
import { createMiddleware } from '../../util/createMiddleware';
import middleware from "./middleware";

export const resolvers: ResolverMap = {
  Query: {
    hello: String
  }
}
