import React, { useRef, useState } from "react";
import { Form, Typography, Input, Button, Select, Space } from "antd";
import axiosInstance from "../../apis/axios";
import { useNavigate } from "react-router-dom";

const AddNewProduct = () => {
  const [form] = Form.useForm();
  const [fileQty, setFilQty] = useState(0);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const uploadRef = useRef(null);
  const [errorUpload, setErrorUpload] = useState("");
  const navigate = useNavigate();

  const onSelectFiles = (event) => {
    setLoadingUpload(true);
    if (event.target.files.length === 0) return;

    const formData = new FormData();

    for (const file of event.target.files) {
      formData.append("images", file);
    }

    axiosInstance
      .post("medias/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLoadingUpload(false);
        setFilQty(response.data.length);
        uploadRef.current.value = null;
        form.setFieldValue("mediaIds", response.data);

        response.data.length === 4
          ? setErrorUpload("")
          : setErrorUpload("Please upload 4 files");
      })
      .catch((err) => {
        setLoadingUpload(false);
        console.log(err);
      });
  };

  const onCreateProduct = (values) => {
    if (fileQty !== 4) {
      return setErrorUpload("Please upload 4 files");
    }

    axiosInstance.post("product/create", {
      name: values["product-name"],
      price: values.price,
      category: values.category,
      stock: values.quantity,
      long_desc: values["short-description"],
      short_desc: values["short-description"],
      mediaIds: values.mediaIds,
    });

    navigate("/products");
  };
  return (
    <div>
      <Form
        form={form}
        onFinish={onCreateProduct}
        size="small"
        layout="vertical"
        name="add-new"
      >
        <Typography.Title>Add New Product</Typography.Title>

        <Form.Item required label="Product Name" name="product-name">
          <Input placeholder="Enter ProductName" />
        </Form.Item>

        <Form.Item required label="Price" name="price">
          <Input type="number" placeholder="Enter Price" />
        </Form.Item>

        <Form.Item required label="Category" name="category">
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

        <Form.Item required label="Quantity" name="quantity">
          <Input
            min={0}
            type="number"
            placeholder="Enter Quantity of product"
          />
        </Form.Item>

        <Form.Item required label="Short Description" name="short-description">
          <Input.TextArea rows={4} placeholder="Enter Short Description" />
        </Form.Item>

        <Form.Item required label="Long Description" name="long-description">
          <Input.TextArea rows={6} placeholder="Enter Long Description" />
        </Form.Item>

        <input
          type="file"
          multiple
          ref={uploadRef}
          accept=".png, .jpeg, .jpg"
          onChange={onSelectFiles}
          style={{ visibility: "hidden" }}
        />

        <Form.Item name="mediaIds" hidden>
          <Input></Input>
        </Form.Item>
        <Space direction="vertical">
          <Button
            onClick={() => {
              uploadRef.current.click();
            }}
            loading={loadingUpload}
          >
            Choose Files | {fileQty} file(s)
          </Button>

          {!!errorUpload && (
            <Typography.Text type="danger">{`you have upload ${fileQty} file(s) of 4 file(s), ${errorUpload} `}</Typography.Text>
          )}

          <Button style={{ marginBottom: 8 }} type="primary" htmlType="submit">
            Create
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default AddNewProduct;
