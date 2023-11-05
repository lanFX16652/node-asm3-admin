import React, { useEffect, useState } from "react";
import classes from "./Login.module.css";
import { Form, Typography, Button, Input } from "antd";
import axiosInstance from "../../apis/axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, setUser } from "../../store/userSlice";

const Login = () => {
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRedux = useSelector(selectUser);

  const submitForm = async (values) => {
    try {
      const result = await axiosInstance.post("admin/login", {
        email: values.email,
        password: values.password,
      });

      setCurrentUser(result.data);
    } catch (error) {
      if (error.response.status === 403) {
        return setErrorMessage("You are forbidden");
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      dispatch(setUser(currentUser));
      localStorage.setItem("user", JSON.stringify(currentUser));
      navigate("/");
    }
  }, [currentUser]);

  useEffect(() => {
    if (userRedux) {
      navigate("/");
    }
  }, [userRedux]);

  return (
    <div className={classes.wrapper}>
      <Form
        className={classes.form}
        form={form}
        size="middle"
        layout="vertical"
        name="login"
        onFinish={submitForm}
      >
        <Typography.Title level={2}>Login</Typography.Title>
        <Form.Item
          label="email"
          name="email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Typography.Text type="danger">{errorMessage}</Typography.Text>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
