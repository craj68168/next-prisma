import type { NextApiRequest, NextApiResponse } from "next";
import { getUsers, updateUser } from "../../../../../prisma/helpers";
import * as Sentry from "@sentry/nextjs";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  const parsedID = parseInt(id ? id.toString() : "");
  if (isNaN(parsedID)) {
    return res.status(400).end();
  }

  if (req.method === "GET") {
    const checkedUsers = await getUsers(parsedID);
    return checkedUsers ? res.send(checkedUsers) : res.status(400).end();
  } else if (req.method === "PUT") {
    const { email, password, firstName, lastName } = req.body;
    const scope = Sentry.getCurrentHub().getScope();
    const transaction = scope?.getTransaction();

    const userChecksSpan = transaction?.startChild({
      op: "function",
      description: "User checks",
    });
    const checkedUsers = await getUsers(parsedID);
    if (!checkedUsers) {
      userChecksSpan?.setStatus("not_found");
      userChecksSpan?.finish();
      return res.status(404).json({ message: "Not found" });
    }
    if (!email || !password || !firstName || !lastName) {
      userChecksSpan?.setStatus("unauthenticated");
      userChecksSpan?.finish();
      return res.status(400).json({ message: "Invalid data" });
    }

    userChecksSpan?.finish();

    let updated = await updateUser(parsedID, {
      email,
      password,
      firstName,
      lastName,
    });
    res.status(200).json(updated);
  }
}
