import { useFormik } from "formik";
import React from "react";
import styled from "styled-components";
import { mutate } from "swr";
import * as Sentry from "@sentry/nextjs";
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
const EditUsers = ({ id }: any) => {
  const formik: any = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    onSubmit: (value) => {
      updateUsers(value);
    },
  });

  const updateUsers = async (data: any) => {
    const scope = Sentry.getCurrentHub().getScope();
    const transaction = Sentry.startTransaction({
      name: "Updating Users",
    });
    scope?.setSpan(transaction);

    transaction
      .startChild({
        op: "mark",
        description: "=== Making the API request ===",
      })
      .finish();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (transaction) {
      headers["sentry-trace"] = transaction.toTraceparent();
    }

    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const mutatingCacheSpan = transaction.startChild({
        op: "cache",
        description: "Mutating SWR cache",
      });
      await mutate(`/api/users/${id}`);
      await mutate("/api/users");
      mutatingCacheSpan.finish();

      const serializeSpan = transaction.startChild({
        op: "serialize",
        description: "Serializing response",
      });

      const data = await res.json();

      serializeSpan.finish();
      transaction.finish();

      return data;
    } else {
      const errorSpan = transaction.startChild({
        op: "mark",
        description: `Failed to update users. Reason: ${res.statusText}`,
      });
      errorSpan.finish();
      transaction.finish();

      throw new Error(`Failed to update users. Reason: ${res.statusText}`);
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

export default EditUsers;
export async function getServerSideProps({ query }: any) {
  const { id } = query;

  return {
    props: {
      id,
    },
  };
}
