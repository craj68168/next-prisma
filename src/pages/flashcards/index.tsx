import { useFormik } from "formik";
import React from "react";
import styled from "styled-components";
import { mutate } from "swr";
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  margin-top: 50px;
  input {
    padding: 8px 10px;
    width: 20%;
  }
  .button {
    margin-left: -215px;
    button {
      padding: 10px 30px;
      cursor: pointer;
      background-color: #cdf1ee;
      color: #000;
      border: 1px solid #000;
      border-radius: 5px;
    }
  }
`;
const Cards = () => {
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
  return (
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
      <div className="button">
        <button onClick={() => formik.handleSubmit()}>Save</button>
      </div>
    </Wrapper>
  );
};

export default Cards;
