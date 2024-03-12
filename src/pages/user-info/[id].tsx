import { useFormik } from "formik";
import React, { useState } from "react";
import { mutate } from "swr";
import * as Sentry from "@sentry/nextjs";
import { UserForm } from "@/components/UserAddEditComponent";

const EditUsers = ({ id }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
      setIsModalOpen(false);
      setLoading(false);
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
      setLoading(false);
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
    <UserForm
      id={id}
      formik={formik}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
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
