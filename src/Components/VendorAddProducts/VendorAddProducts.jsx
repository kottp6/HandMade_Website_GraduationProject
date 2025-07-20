import React, { useEffect, useState } from 'react';
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
    status: 'pending',
  });
  const [imageFile, setImageFile] = useState(null);
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
  const categories = Object.keys(categoryMap);
  const getCategoryId = (name) => categoryMap[name] || 0;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        title: selectedProduct.title || '',
        description: selectedProduct.description || '',
        price: selectedProduct.price || '',
        category: selectedProduct.categoryName || '',
        stock: selectedProduct.stock || '',
        status: selectedProduct.status || 'pending',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        status: 'pending',
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setErrors(prev => ({ ...prev, image: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Product title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Stock is required';
    if (!imageFile && !isEditMode) newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "react_uploads"); // Replace this
    data.append("cloud_name", "dojghbhxq");       // Replace this

    const res = await fetch("https://api.cloudinary.com/v1_1/dojghbhxq/image/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    return json.secure_url;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let imgURL = selectedProduct?.imgURL || '';

      if (imageFile) {
        toast.loading('Uploading image...');
        imgURL = await uploadToCloudinary(imageFile);
        toast.dismiss();
      }

      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: getCategoryId(formData.category),
        categoryName: formData.category,
        stock: parseInt(formData.stock),
        imgURL,
        status: formData.status,
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode) {
        const productRef = doc(db, 'Products', selectedProduct.id);
        await updateDoc(productRef, productData);
        toast.success('Product updated!');
      } else {
        productData.createdAt = new Date().toISOString();
        productData.vendorId = auth.currentUser.uid;
        productData.vendorRef = doc(db, 'Vendors', auth.currentUser.uid);
        await addDoc(collection(db, 'Products'), productData);
        toast.success('Product added!');
      }

      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        status: 'pending',
      });
      setImageFile(null);
      onSaveComplete && onSaveComplete();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save product.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 rounded-lg bg-[#F5F5F1] shadow-xl p-8">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
        <h2 className="text-2xl font-bold text-[#A78074] mb-6 text-center">
          {isEditMode ? 'Update Product' : 'Add New Product'}
        </h2>
        <div className="space-y-4">
          {/* Basic Inputs */}
          {['title', 'description', 'price', 'stock'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-2">
                {field[0].toUpperCase() + field.slice(1)}
              </label>
              {field === 'description' ? (
                <textarea
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-[#A77F73] ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                />
              ) : (
                <input
                  type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-[#A77F73] ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                />
              )}
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}

          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-[#A77F73] ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border px-3 py-2 rounded-md"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-[#A77F73] text-white py-2 px-4 rounded-md hover:scale-[1.04] cursor-pointer hover:bg-[#90675F] focus:outline-none transition duration-500"
          >
            {isEditMode ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddProduct;
