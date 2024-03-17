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

export const deleteUser = async (id: any) => {
  const user = await getUsers(id);
  console.log("user", user);

  if (user) {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }
};
