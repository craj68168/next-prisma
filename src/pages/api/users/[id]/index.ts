import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  const { id } = req.query;
  const parsedID = parseInt(id ? id.toString() : "");
  if (isNaN(parsedID)) {
    return res.status(400).end();
  }
  const user = await prisma.user.findUnique({ where: { id: parsedID } });
  return user ? res.send(user) : res.status(400).end();
}
