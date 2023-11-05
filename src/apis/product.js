import { useEffect, useState } from "react";
import axiosInstance from "./axios";

export const getProducts = async (page, limit, search) => {
    try {
        const result = await axiosInstance.get("product/list", {
            params: {
                page,
                limit,
                search
            }
        })
        return result.data
    } catch (error) {
        throw new Error(error)
    }
}

export const useGetProducts = (page, limit) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [response, setResponse] = useState()
    useEffect(() => {
        setLoading(true)

        getProducts(page, limit)
            .then(result => {
                setProducts(result.products)
                setResponse(result)
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                throw new Error(error)
            })
    }, []);

    const refetchProduct = (newPage, newLimit, search) => {
        setLoading(true)
        getProducts(newPage, newLimit, search)
            .then(result => {
                setProducts(result.products)
                setResponse(result)
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                throw new Error(error)
            })
    }

    return [products, isLoading, response, refetchProduct]
}