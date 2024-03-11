import prisma from ".";
export const getUsers = async (id: any) => {
  return await prisma.user.findFirst({
    where: {
      id,
    },
  });
};

export const updateUser = async (id: number, data: any) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};
