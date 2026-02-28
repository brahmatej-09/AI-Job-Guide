import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello" },
  async ({ event }) => {
    console.log("Event received:", event.data);
    return { success: true };
  }
);

export const heyTej = inngest.createFunction(
  { id: "hey-tej" },
  { event: "app/hey-tej" },
  async ({ event }) => {
    console.log("👋 Hey Tej Event Received:");
    console.log("Name:", event.data.name);
    console.log("Goal:", event.data.goal);
    console.log("Time:", event.data.time);

    return "hey tej working";
  }
);