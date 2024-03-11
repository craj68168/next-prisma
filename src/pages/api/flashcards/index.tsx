import prisma from "../../../../prisma";

export const createFlashcard = async (data: any) => {
  return await prisma.user.create({
    data,
  });
};

export const updateFlashcard = async (id: number, data: any) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};
