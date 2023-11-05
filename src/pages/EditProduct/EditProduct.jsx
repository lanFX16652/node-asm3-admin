import React, { useState, useEffect } from "react";
import { Form, Typography, Button, Input, Select } from "antd";
import axiosInstance from "../../apis/axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const [form] = Form.useForm();
  const [productDetail, setProductDetail] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`product/${params.productId}`, {})
      .then((res) => {
        setProductDetail(res.data);

        form.setFieldsValue({
          name: res.data.name,
          category: res.data.category,
          quantity: res.data.stock,
          shortDescription: res.data.short_desc,
          longDescription: res.data.long_desc,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.productId, form]);

  if (!productDetail) return;

  const onEdit = (values) => {
    axiosInstance
      .post("edit-product", {
        productId: params.productId,
        values: {
          name: values.name,
          category: values.category,
          stock: +values.quantity,
          short_desc: values.shortDescription,
          long_desc: values.longDescription,
        },
      })
      .then((res) => {
        navigate(`/products`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Form
        form={form}
        size="middle"
        layout="vertical"
        name="edit"
        onFinish={onEdit}
      >
        <Typography.Title>Edit Product</Typography.Title>
        <Form.Item label="Product Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Select
            options={[
              {
                label: "Iphone",
                value: "iphone",
              },
              {
                label: "Ipad",
                value: "ipad",
              },
              {
                label: "Airpod",
                value: "airpod",
              },
              {
                label: "Watch",
                value: "watch",
              },
            ]}
            placeholder="Enter category"
          />
        </Form.Item>

        <Form.Item label="Quantity" name="quantity">
          <Input
            min={0}
            type="number"
            placeholder="Enter Quantity of product"
          />
        </Form.Item>

        <Form.Item label="Short Description" name="shortDescription">
          <Input.TextArea rows={4} placeholder="Enter Short Description" />
        </Form.Item>

        <Form.Item lable="Long Description" name="longDescription">
          <Input.TextArea rows={6} placeholder="Enter Long Description" />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProduct;
