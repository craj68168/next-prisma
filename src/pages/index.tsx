import Head from "next/head";
import { Button, Modal } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import { mutate } from "swr";
const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  button {
    padding: 10px 30px;
    height: 100%;
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  input {
    padding: 15px 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
`;
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formik: any = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    onSubmit: (value) => {
      handleSubmit(value);
    },
  });

  const handleSubmit = async (value: any) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });

    if (res.ok) {
      mutate("/api/users");
      return await res.json();
    } else {
      alert(`Failed to create flashcard. Reason: ${res.statusText}`);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    formik.handleSubmit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Head>
        <title>User</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ButtonWrapper>
        <Button type={"primary"} onClick={() => showModal()}>
          Create
        </Button>
      </ButtonWrapper>
      <Modal
        title="Create Users"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Wrapper>
          <input
            type={"email"}
            placeholder="Enter Email"
            name="email"
            value={formik?.email}
            onChange={formik.handleChange}
          />
          <input
            type={"password"}
            placeholder="Enter Password"
            name="password"
            value={formik?.password}
            onChange={formik.handleChange}
          />
          <input
            type={"text"}
            placeholder="Enter First Name"
            name="firstName"
            value={formik?.firstName}
            onChange={formik.handleChange}
          />
          <input
            type={"text"}
            placeholder="Enter Last Name"
            name="lastName"
            value={formik?.lastName}
            onChange={formik.handleChange}
          />
        </Wrapper>
      </Modal>
    </>
  );
}
