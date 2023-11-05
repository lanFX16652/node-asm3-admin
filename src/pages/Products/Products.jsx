import React, { useState, useEffect } from "react";
import { useGetProducts } from "../../apis/product.js";
import { Table, Button, Space, Modal } from "antd";
import { parseCurrency } from "../../services/index.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Modal from "../../components/Modal/Modal.js";

const Products = () => {
  const [products, isLoading, response, refetchProduct] = useGetProducts(1, 5);
  const [pageProduct, setPageProduct] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  //deleteProduct variables
  // const [openModal, setOpenModal] = useState(false);
  // const [loadingCartCheck, setLoadingCartCheck] = useState(false);
  // const [isInCart, setIsInCart] = useState(false);
  // const [productIdChoose, setProductIdChoose] = useState("");

  // const openDeleteModalHandler = (productId) => {
  //   setProductIdChoose(productId);
  //   setOpenModal(true);
  //   setLoadingCartCheck(true);
  //   axios.get("http://localhost:5000")
  // }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState("");

  const showModal = (id) => {
    setIsModalOpen(true);
    setProductId(id);
  };

  const handleOk = (id) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}delete-product`, {
        productId: id,
      })
      .then((res) => {
        refetchProduct(1, 5);
        setPageProduct(1);
      })
      .catch((err) => {
        console.log(err);
      });

    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/unauthorized");
    }
  }, [user]);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      render: (detail, record) => <p>{parseCurrency(record?.price)}</p>,
    },
    {
      title: "IMAGE",
      dataIndex: "img1",
      key: "img1",
      render: (detail, record) => (
        <img src={record?.img1} style={{ width: "80px" }} />
      ),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "STOCK",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "EDIT",
      dataIndex: "edit",
      key: "edit",
      render: (detail, record) => (
        <Space>
          <Button
            type="primary"
            primary
            onClick={() => navigate(`/edit-product/${record?._id}`)}
          >
            Update
          </Button>
          <Button type="primary" danger onClick={() => showModal(record?._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      refetchProduct(pageProduct, limit, search);
    }, 500);

    return () => {
      clearTimeout(debounceSearch);
    };
  }, [search, pageProduct, limit]);

  return (
    <>
      <div>
        <Table
          bordered
          scroll={{ x: true }}
          columns={columns}
          dataSource={products}
          loading={isLoading}
          pagination={{
            pageSize: 5,
            total: response?.totalProducts,
            onChange: (page, pageSize) => {
              refetchProduct(page, pageSize, search);
              setPageProduct(page);
            },
          }}
          title={() => (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3>Products</h3>
                <input
                  placeholder="Enter Search!"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <Button
                type="primary"
                style={{ backgroundColor: "green" }}
                onClick={() => navigate("/add-new-product")}
              >
                Add New
              </Button>
            </div>
          )}
        />

        <Modal
          title="Delete Product"
          open={isModalOpen}
          onOk={() => handleOk(productId)}
          onCancel={handleCancel}
        >
          <p>Are you sure you want to DELETE this product?</p>
        </Modal>
      </div>
    </>
  );
};

export default Products;
