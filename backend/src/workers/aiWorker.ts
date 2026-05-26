import { Worker} from "bullmq";
import bullmqConnection from "../lib/bullMQConnection";

const worker = new Worker("assignment-generation", async(job)=>{
    console.log("Job recieved", job.data);
},{connection:bullmqConnection})

worker.on("completed",(job) => {
    console.log(`Job ${job.id} completed!`);
});

worker.on("failed",(job,error)=>{
    console.error(`Job ${job?.id} failed:`,error);
});

export default worker;