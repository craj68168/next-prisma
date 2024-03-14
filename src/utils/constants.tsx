import { mutate } from "swr";
import * as Yup from "yup";
import * as Sentry from "@sentry/nextjs";

export const handleSubmit = async (value: any) => {
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
  }
};

export const getAllUsers = async () => {
  const res = await fetch("/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    mutate("/api/users");
    return await res.json();
  }
};

export const getOneUsers = async (id: any) => {
  const res = await fetch(`/api/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    mutate(`/api/users/${id}`);
    return await res.json();
  }
};

export const updateUsers = async (data: any, id: any) => {
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

export const userValidation = Yup.object().shape({
  email: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
});
