import React from "react";
import { Button, Modal } from "antd";
import { ButtonWrapper, Wrapper } from "./UserAddEdit.style";

interface IProps {
  id?: string | number;
  formik?: any;
  isModalOpen?: boolean;
  setIsModalOpen?: any;
}
const UserForm: React.FC<IProps> = ({
  id,
  formik,
  isModalOpen,
  setIsModalOpen,
}) => {
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    formik.handleSubmit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <ButtonWrapper>
        <Button type={"primary"} onClick={() => showModal()}>
          Create
        </Button>
      </ButtonWrapper>
      <Modal
        title={id ? "Update User" : "Create User"}
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
          <div style={{ color: "red" }}>
            {formik?.touched?.email && formik.errors?.email
              ? formik.errors?.email
              : null}
          </div>
          <input
            type={"password"}
            placeholder="Enter Password"
            name="password"
            value={formik?.password}
            onChange={formik.handleChange}
          />
          <div style={{ color: "red" }}>
            {formik?.touched?.password && formik.errors?.password
              ? formik.errors?.password
              : null}
          </div>
          <input
            type={"text"}
            placeholder="Enter First Name"
            name="firstName"
            value={formik?.firstName}
            onChange={formik.handleChange}
          />
          <div style={{ color: "red" }}>
            {formik?.touched?.firstName && formik.errors?.firstName
              ? formik.errors?.firstName
              : null}
          </div>
          <input
            type={"text"}
            placeholder="Enter Last Name"
            name="lastName"
            value={formik?.lastName}
            onChange={formik.handleChange}
          />
          <div style={{ color: "red" }}>
            {formik?.touched?.lastName && formik.errors?.lastName
              ? formik.errors?.lastName
              : null}
          </div>
        </Wrapper>
      </Modal>
    </>
  );
};

export { UserForm };
