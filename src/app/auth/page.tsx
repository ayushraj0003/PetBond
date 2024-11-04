"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { FileUpload } from "@/components/ui/file-upload";
import { auth, db } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

// Define TypeScript interfaces
interface Feature {
  title: string;
  image: string;
  description: string;
}

interface PetData {
  name: string;
  type: string;
  age: string;
  fileUrl: string;
  breed?: string;
  color?: string;
  birdType?: string;
}

const features: Feature[] = [
  {
    title: "Find Playdates",
    image: "/Images/photo3.jpg",
    description:
      "Connect with other pet owners and arrange fun playdates for your furry friends.",
  },
  {
    title: "Discover Pet-Friendly Spots",
    image: "/Images/photo4.jpg",
    description:
      "Explore the best parks, cafes, and events that welcome pets in your area.",
  },
  {
    title: "Share Pet Stories",
    image: "/Images/photo1.jpg",
    description:
      "Create a profile for your pet and share their adorable moments with the community.",
  },
  {
    title: "Expert Advice",
    image: "/Images/photo5.jpg",
    description:
      "Access tips and advice from pet care professionals to keep your furry friend happy and healthy.",
  },
];

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState("initial");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pet, setPet] = useState("");
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [color, setColor] = useState("");
  const [birdType, setBirdType] = useState("");
  const [error, setError] = useState("");
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPet = e.target.value;
    setPet(selectedPet);
    setFormState(selectedPet);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          const token = await userCredential.user.getIdToken();
          localStorage.setItem("userToken", token);
          router.push("/dashboard");
        }
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        if (!fileUrl && formState !== "initial") {
          setError("Please upload a file before proceeding");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const petData: PetData = {
          name: petName,
          type: pet,
          age,
          fileUrl
        };

        if (pet === "dog" || pet === "cat") {
          petData.breed = breed;
          petData.color = color;
        } else if (pet === "bird") {
          petData.birdType = birdType;
        }

        await addDoc(collection(db, "users"), {
          uid: userCredential.user.uid,
          name,
          email,
          pet: petData,
          createdAt: new Date().toISOString(),
        });

        const token = await userCredential.user.getIdToken();
        localStorage.setItem("userToken", token);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setPet("");
    setFormState("initial");
  };

  const renderForm = () => {
    const dogBreeds = ["Labrador", "German Shepherd", "Bulldog", "Beagle"];
    const catBreeds = ["Persian", "Maine Coon", "Siamese", "Ragdoll"];

    switch (formState) {
      case "initial":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pet">Select Pet Type</Label>
              <select
                id="pet"
                value={pet}
                onChange={handlePetChange}
                className="block w-full rounded-md border-gray-300 shadow-sm p-2"
              >
                <option value="">Select your pet</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
              </select>
            </div>
          </>
        );
      case "dog":
      case "cat":
        const breeds = formState === "dog" ? dogBreeds : catBreeds;
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="petName">Pet Name</Label>
              <Input
                id="petName"
                type="text"
                placeholder="Enter your pet's name"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <select
                id="breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm p-2"
              >
                <option value="">Select your {formState}&apos;s breed</option>
                {breeds.map((breedOption) => (
                  <option key={breedOption} value={breedOption}>
                    {breedOption}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="text"
                placeholder="Enter your pet's age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="text"
                placeholder="Enter your pet's color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <FileUpload onFileUploadComplete={setFileUrl} />
            <Button
              type="button"
              onClick={handleBack}
              className="mt-4 bg-gray-300 hover:bg-gray-400 w-full"
            >
              Back
            </Button>
          </>
        );
      case "bird":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="petName">Pet Name</Label>
              <Input
                id="petName"
                type="text"
                placeholder="Enter your bird's name"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birdType">Bird Type</Label>
              <select
                id="birdType"
                value={birdType}
                onChange={(e) => setBirdType(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm p-2"
              >
                <option value="">Select bird type</option>
                <option value="parrot">Parrot</option>
                <option value="budgie">Budgie</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="text"
                placeholder="Enter your bird's age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <FileUpload onFileUploadComplete={setFileUrl} />
            <Button
              type="button"
              onClick={handleBack}
              className="mt-4 bg-gray-300 hover:bg-gray-400 w-full"
            >
              Back
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  const formVariants = {
    initial: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    enter: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-pink-100 to-purple-200">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">
            PetBond
          </h1>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial="exit"
              animate="enter"
              exit="exit"
              variants={formVariants}
            >
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                {isLogin ? "Welcome Back!" : "Create an Account"}
              </h2>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={formState}
                      initial="exit"
                      animate="enter"
                      exit="exit"
                      variants={formVariants}
                    >
                      {renderForm()}
                    </motion.div>
                  </AnimatePresence>
                )}
  
                {isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="loginEmail">Email</Label>
                      <Input
                        id="loginEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loginPassword">Password</Label>
                      <Input
                        id="loginPassword"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}
  
                <Button
                  type="submit"
                  className={`w-full ${
                    isLoading 
                      ? 'bg-purple-400 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : isLogin
                    ? "Login"
                    : "Sign Up"}
                </Button>
              </form>
            </motion.div>
          </AnimatePresence>
  
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button
                type="button"
                variant="link"
                className="text-purple-600 hover:text-purple-800"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFormState("initial");
                }}
                disabled={isLoading}
              >
                {isLogin ? "Sign up" : "Login"}
              </Button>
            </p>
          </div>
        </div>
      </div>
  
      {/* Right Section - Features Showcase */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-xl overflow-hidden"
            >
              <div className="relative w-full h-[400px]">
                <Image
                  src={features[currentFeature].image}
                  alt={features[currentFeature].title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  {features[currentFeature].title}
                </h3>
                <p className="text-gray-600">
                  {features[currentFeature].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}