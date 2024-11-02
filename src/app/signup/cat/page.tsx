// app/signup/cat.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function CatSignup() {
  const [catName, setCatName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [color, setColor] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCatSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!catName || !breed || !age || !color) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Redirect to a success page or perform any further actions here
      router.push('/dashboard');
    } catch (err) {
      setError('Error saving cat data');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Cat Registration</h2>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            <AlertDescription className="ml-2 text-sm text-red-800">{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleCatSignup} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="catName" className="text-lg font-semibold text-gray-900">Name</Label>
            <Input
              id="catName"
              type="text"
              placeholder="Enter your cat's name"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:border-blue-600 focus:ring focus:ring-blue-100"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="breed" className="text-lg font-semibold text-gray-900">Breed</Label>
            <Select
              id="breed"
              placeholder="Select breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              required
              className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-600 focus:ring focus:ring-blue-100"
            >
              <SelectItem value="Siamese">Siamese</SelectItem>
              <SelectItem value="Persian">Persian</SelectItem>
              <SelectItem value="Maine Coon">Maine Coon</SelectItem>
              <SelectItem value="Sphynx">Sphynx</SelectItem>
              <SelectItem value="British Shorthair">British Shorthair</SelectItem>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="age" className="text-lg font-semibold text-gray-900">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter age in years"
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
              placeholder="Enter color of the cat"
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
            Want to register a different pet?{' '}
            <a href="/signup" className="text-blue-600 hover:underline font-semibold">Go back</a>
          </p>
        </div>
      </div>
    </div>
  );
}
