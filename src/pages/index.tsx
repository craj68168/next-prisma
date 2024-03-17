import Head from "next/head";
import { useFormik } from "formik";
import { useState } from "react";
import { UserForm } from "@/components/UserAddEditComponent";
import { Button, Popconfirm, Table, notification } from "antd";
import styled from "styled-components";
import { useMutation, useQuery } from "react-query";
import {
  getAllUsers,
  handleSubmit,
  updateUsers,
  userValidation,
} from "@/utils/constants";
import { deleteUser } from "../../prisma/helpers";
const TableWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 50%;
    margin: 20px;
  }

  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  .table-row {
  }
  .edit {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .table-heads {
    align-items: row;
  }
`;
const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState(null);
  const initialValues = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  };
  const formik: any = useFormik({
    initialValues: initialValues,
    validationSchema: userValidation,
    onSubmit: (value, { resetForm }) => {
      postUser();
      resetForm();
    },
  });

  const { data: allUserData, refetch } = useQuery("get-all-user", getAllUsers, {
    onError: () => {
      notification.error({
        message: `Failed to get User`,
      });
    },
    keepPreviousData: true,
  });

  const { mutate: postUser } = useMutation({
    mutationFn: () =>
      id ? updateUsers(formik?.values, id) : handleSubmit(formik.values),
    onSuccess: () => {
      setIsModalOpen(false);
      setId(null);
      refetch();
      notification.success({
        message: id ? "Updated " : "Created " + "Successfully",
      });
    },
    onError: () => {
      notification.error({
        message: `Failed to create user`,
      });
    },
  });
  const { mutate: deleteOneUser } = useMutation(deleteUser, {
    onSuccess: () => {
      setIsModalOpen(false);
      setId(null);
      refetch();
      notification.success({
        message: "Deleted Successfully",
      });
    },
    onError: () => {
      notification.error({
        message: `Failed to Delete User`,
      });
    },
  });
  const userColumns: any = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "1",
      render: (row: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setId(row?.id);
                formik.setFieldValue("email", row?.email);
                formik.setFieldValue("password", row?.password);
                formik.setFieldValue("firstName", row?.firstName);
                formik.setFieldValue("lastName", row?.lastName);
                setIsModalOpen(true);
              }}
            >
              Edit
            </Button>
            {/* <Popconfirm
              title={"Deleting.Is that OK?"}
              onConfirm={() => deleteOneUser(row?.id)}
              okText={"OK"}
              cancelText={"Cancel"}
              okButtonProps={{ size: "middle" }}
              cancelButtonProps={{ size: "middle" }}
            >
              <Button shape={"round"}>Delete</Button>
            </Popconfirm> */}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      <UserForm
        formik={formik}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        id={id}
        setId={setId}
      />
      <TableWrapper>
        <Table dataSource={allUserData || []} columns={userColumns} />
      </TableWrapper>
    </>
  );
};

export default Home;
