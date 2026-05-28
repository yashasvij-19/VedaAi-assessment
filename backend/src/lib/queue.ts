import { Queue } from "bullmq";
import redis from "./redis";

const assignmentQueue = new Queue("assignment-generation", {
  connection: redis,
});

export default assignmentQueue;