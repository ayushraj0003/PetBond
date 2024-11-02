'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pet, setPet] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword || !pet) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Save user info before proceeding to the pet page
    try {
      const userId = email;

      await setDoc(doc(db, 'users', userId), {
        name,
        email,
        password,
        pet,
        createdAt: new Date().toISOString(),
      });

      // Navigate to the next page based on selected pet
      router.push(`/signup/${pet.toLowerCase()}`);
    } catch (err) {
      setError('Error saving user data');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Create an Account</h2>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            <AlertDescription className="ml-2 text-sm text-red-800">{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleNext} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-lg font-semibold text-gray-900">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:border-blue-600 focus:ring focus:ring-blue-100"
              required
            />
     
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-lg font-semibold text-gray-900">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:border-blue-600 focus:ring focus:ring-blue-100"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-lg font-semibold text-gray-900">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:border-blue-600 focus:ring focus:ring-blue-100"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword" className="text-lg font-semibold text-gray-900">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:border-blue-600 focus:ring focus:ring-blue-100"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pet" className="text-lg font-semibold text-gray-900">Select Your Pet Animal</Label>
            <select
              id="pet"
              value={pet}
              onChange={(e) => setPet(e.target.value)}
              className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:border-blue-600 focus:ring focus:ring-blue-100"
              required
            >
              <option value="" disabled>Select an option</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Parrot">Parrot</option>
              <option value="Budgerigar">Budgerigar</option>
            </select>
          </div>
          <Button type="submit" className="w-full py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">
            Next
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-semibold">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
