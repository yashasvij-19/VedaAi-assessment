import { Queue } from "bullmq";
import bullmqConnection from "./bullMQConnection";

const assignmentQueue = new Queue("assignment-generation", { connection: bullmqConnection });

export default assignmentQueue;