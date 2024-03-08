import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  if (req.method === "GET") {
    const users = await prisma.user.findMany();
    return res.send(users);
  } else if (req.method === "POST") {
    const { body: data } = req;
    const newUser = await prisma.user.create({ data });
    return res.status(201).send(newUser);
  }
}
