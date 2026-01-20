import { type ConnectionOptions } from "bullmq";

// TODO: Check the configs
export const connection: ConnectionOptions = {
  url: process.env.REDIS_URL,
};
