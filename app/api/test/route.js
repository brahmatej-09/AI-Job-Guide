import { inngest } from "@/lib/inngest/client";

export async function GET() {
  await inngest.send({
    name: "test/hello",
    data: {
      user: "Tej",
      time: Date.now(),
    },
  });

  return Response.json({ sent: true });
}