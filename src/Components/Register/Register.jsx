import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {  doc , setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase';
import Navbar from '../Navbar/Navbar';

// Zod schema with role field
const schema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email'),
    phone: z
      .string()
      .min(10, 'Phone must be at least 10 digits')
      .regex(/^[0-9]+$/, 'Phone must contain only digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['customer', 'vendor'], { required_error: 'Please select a role' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const Register = () => {

  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState(null);
  const [loading, setLoading] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    console.log('Register form data:', data);
    // handle API call here
    setFirebaseError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });
      const userData = {
        uid: user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        createdAt: new Date().toISOString(),
        displayName: `${data.firstName} ${data.lastName}`
      };
      await setDoc(doc(db, 'Users', user.uid), userData);
      toast.success("Account created successfully!");

      if(user) {
        if (data.role === 'vendor') {
          navigate('/vendorform');
        } else {
          navigate('/login');
        }
      } 
    } catch (error) {
      console.error('Firebase error:', error);
        switch (error.code) {
          case 'auth/email-already-in-use':
            setFirebaseError('Email already registered.');
            break;
          case 'auth/weak-password':
            setFirebaseError('Weak password.');
            break;
          default:
            setFirebaseError('Registration failed. Try again.');
            toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }

  };

  return (
   
    <>
     <Navbar />
    <section className="min-h-screen bg-[#F8F1EF] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-lg p-8 max-w-xl w-full"
      >
        <h2 className="text-3xl font-bold text-center text-[#A77F73] mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              {...register('firstName')}
              placeholder="John"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#A77F73] outline-none"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              {...register('lastName')}
              placeholder="Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#A77F73] outline-none"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#A77F73] outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              {...register('phone')}
              placeholder="0123456789"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#A77F73] outline-none"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#A77F73] outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#A77F73] outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-2">Role</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-gray-700">
                <input type="radio" value="customer" {...register('role')} />
                Customer
              </label>
              <label className="flex items-center gap-2 text-gray-700">
                <input type="radio" value="vendor" {...register('role')} />
                Vendor
              </label>
            </div>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[#A77F73] text-white py-2.5 rounded-md font-medium text-lg transition hover:bg-[#90675F]"
            >
              Register
            </motion.button>
          </div>
          {firebaseError && <p className="text-red-600 text-center mt-2">{firebaseError}</p>}
          {loading && <p className="text-gray-600 text-center mt-2">Registering...</p>}

        </form>
      </motion.div>
    </section>
    </>
  );
};

export default Register;