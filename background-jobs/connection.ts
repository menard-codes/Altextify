import { type ConnectionOptions } from "bullmq";

export const connection: ConnectionOptions = {
  url: process.env.REDIS_URL,
};
