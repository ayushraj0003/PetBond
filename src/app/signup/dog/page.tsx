'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { FileUpload } from '@/components/ui/file-upload';

export default function DogForm() {
  const [dogName, setDogName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [color, setColor] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!dogName || !breed || !age || !color) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const userId = localStorage.getItem('userEmail'); // Retrieve user ID from localStorage

      // Update the user document with the dog details
      await updateDoc(doc(db, 'users', userId), {
        petDetails: {
          type: 'Dog',
          name: dogName,
          breed,
          age,
          color,
        },
      });

      router.push('/dashboard');
    } catch (err) {
      setError('Error saving dog details');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Dog Details</h2>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            <AlertDescription className="ml-2 text-sm text-red-800">{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="dogName" className="text-lg font-semibold text-gray-900">Name</Label>
            <Input
              id="dogName"
              type="text"
              placeholder="Enter your dog's name"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:border-blue-600 focus:ring focus:ring-blue-100"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="breed" className="text-lg font-semibold text-gray-900">Breed</Label>
            <select
              id="breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:border-blue-600 focus:ring focus:ring-blue-100"
              required
            >
              <option value="" disabled>Select breed</option>
              <option value="Labrador Retriever">Labrador Retriever</option>
              <option value="German Shepherd">German Shepherd</option>
              <option value="Golden Retriever">Golden Retriever</option>
              <option value="Bulldog">Bulldog</option>
              <option value="Poodle">Poodle</option>
              {/* Add more dog breeds as necessary */}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="age" className="text-lg font-semibold text-gray-900">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your dog's age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:border-blue-600 focus:ring focus:ring-blue-100"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="color" className="text-lg font-semibold text-gray-900">Color</Label>
            <Input
              id="color"
              type="text"
              placeholder="Enter your dog's color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:border-blue-600 focus:ring focus:ring-blue-100"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <FileUpload/>
          </div>
          <Button type="submit" className="w-full py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
