import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) return null;

  try {
    let loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      loggedInUser = await db.user.update({
        where: { id: loggedInUser.id },
        data: {
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
          imageurl: user.imageUrl,
        },
      });
    } else {
      loggedInUser = await db.user.create({
        data: {
          clerkUserId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
          imageurl: user.imageUrl,
        },
      });
    }

    return loggedInUser;
  } catch (error) {
    console.error("User DB sync error:", error);
    return null;
  }
};