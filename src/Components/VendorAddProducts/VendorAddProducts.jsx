import React, { useEffect } from 'react'
import { useState } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AddProduct = ({ selectedProduct, onSaveComplete }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        imgURL: '',
        status: "pending",
        // rating: 0
    });

    const [errors, setErrors] = useState({});
    const isEditMode = selectedProduct !== null;

    const categoryMap = {
        'Electronics': 1,
        'Clothing': 2,
        'Books': 3,
        'Home & Garden': 4,
        'Sports': 5,
        'Beauty': 6,
        'Food & Beverage': 7,
        'Other': 8
    };

    // Get category names for display
    const categories = Object.keys(categoryMap);

    // Function to get category ID from name
    const getCategoryId = (categoryName) => {
        return categoryMap[categoryName] || 0;
    };

    useEffect(() => {
    if (isEditMode) {
        setFormData({
            title: selectedProduct.title || '',
            description: selectedProduct.description || '',
            price: selectedProduct.price || '',
            category: selectedProduct.categoryName || '',
            stock: selectedProduct.stock || '',
            imgURL: selectedProduct.imgURL || '',
            status: selectedProduct.status || 'pending',
        });
    } else {
        setFormData({
            title: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            imgURL: '',
            status: 'pending',
        });
    }
}, [selectedProduct]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Product title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Valid price is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.stock || formData.stock < 0) {
            newErrors.stock = 'Stock quantity is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            const imageURL = formData.imgURL.trim();
            if (!imageURL) {
                setErrors(prev => ({ ...prev, imgURL: 'Please enter an image URL.' }));
                return;
            }
        
            try {
                if (isEditMode) {
                    const productRef = doc(db, 'Products', selectedProduct.id);
                    await updateDoc(productRef, {
                        title: formData.title,
                        description: formData.description,
                        price: parseFloat(formData.price),
                        category_id: getCategoryId(formData.category),
                        categoryName: formData.category,
                        stock: parseInt(formData.stock),
                        imgURL: imageURL,
                        status: formData.status,
                        updatedAt: new Date().toISOString(),
                        // rating: 0
                    });
                    toast.success('Product updated successfully!');
                } else {
                    const productData = {
                        title: formData.title,
                        description: formData.description,
                        price: parseFloat(formData.price),
                        category_id: getCategoryId(formData.category),
                        categoryName: formData.category,
                        stock: parseInt(formData.stock),
                        imgURL: imageURL,
                        status: 'pending',
                        createdAt: new Date().toISOString(),
                        vendorId: auth.currentUser.uid,
                        vendorRef: doc(db, 'Vendors', auth.currentUser.uid),
                        // rating: 0
                    };
                    await addDoc(collection(db, 'Products'), productData);
                    toast.success('Product created successfully!');
                }

                setFormData({
                    title: '',
                    description: '',
                    price: '',
                    category: '',
                    stock: '',
                    imgURL: '',
                    status: 'pending',
                });

                onSaveComplete && onSaveComplete(); // Reset selected product in parent

            } catch (error) {
                console.error('Error saving product:', error);
                toast.error('Something went wrong. Please try again.');
            }
        };
        
    };

    return (
        <div className="max-w-2xl mx-auto mt-4 rounded-lg bg-[#F5F5F1] shadow-xl  p-8">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
        > 
        <h2 className="text-2xl font-bold text-[#A78074] mb-6 text-center">
            {/* Add New Product */}
        {isEditMode ? 'Update Product' : 'Add New Product'} 
        </h2> 
            <div className="space-y-4">
                {/* Product Title */}
                <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-[#A77F73] ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter product title"
                />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
                </div>

                {/* Description */}
                <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none  focus:border-[#A77F73] ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter product description"
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
                </div>

                {/* Price */}
                <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (EGP)
                </label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="1"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none  focus:border-[#A77F73] ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                />
                {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
                </div>

                {/* Category */}
                <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none  focus:border-[#A77F73] ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="">Select a category</option>
                    {categories.map((categoryName) => (
                    <option key={categoryName} value={categoryName}>
                        {categoryName}
                    </option>
                    ))}
                </select>
                {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
                </div>

                {/* Stock */}
                <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                </label>
                <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none  focus:border-[#A77F73] ${
                    errors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                />
                {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                )}
                </div>

                {/* Image URL */}
                <div>
                    <label htmlFor="imgURL" className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                    </label>
                    <input
                        type="text"
                        id="imgURL"
                        name="imgURL"
                        value={formData.imgURL}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none  focus:border-[#A77F73] ${
                        errors.imgURL ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://example.com/image.jpg"
                    />
                    {errors.imgURL && (
                        <p className="text-red-500 text-sm mt-1">{errors.imgURL}</p>
                    )}
                </div>


                {/* Submit Button */}
                <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-[#A77F73] text-white py-2 px-4 rounded-md hover:scale-[1.04] cursor-pointer hover:bg-[#90675F] focus:outline-none focus:ring-2 focus:ring-[#A78074] focus:ring-offset-2 transition duration-500"
                >
                    {isEditMode ? 'Update Product' : 'Add Product'}
                </button>
            </div>
        </motion.div>
        </div>
    );
};

export default AddProduct;
