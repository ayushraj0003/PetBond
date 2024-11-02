'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // Firestore config
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function BirdSignup() {
  const [birdType, setBirdType] = useState('');
  const [age, setAge] = useState('');
  const [color, setColor] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!birdType || !age || !color) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const userId = 'bird_user'; // Replace with actual user ID if necessary

      await setDoc(doc(db, 'birds', userId), {
        birdType,
        age,
        color,
        createdAt: new Date().toISOString(),
      });

      router.push('/dashboard'); // Redirect to dashboard after successful submission
    } catch (err) {
      setError('Error saving bird data');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Bird Signup</h2>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            <AlertDescription className="ml-2 text-sm text-red-800">{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="birdType" className="text-lg font-semibold text-gray-900">Select Bird</Label>
            <Select
              id="birdType"
              value={birdType}
              onChange={(e) => setBirdType(e.target.value)}
              required
              className="rounded-md border border-gray-300 bg-gray-50 text-gray-800"
            >
              <SelectItem value="">Select a bird</SelectItem>
              <SelectItem value="parrot">Parrot</SelectItem>
              <SelectItem value="budgerigar">Budgerigar</SelectItem>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="age" className="text-lg font-semibold text-gray-900">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter the age of your bird"
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
              placeholder="Enter the color of your bird"
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
