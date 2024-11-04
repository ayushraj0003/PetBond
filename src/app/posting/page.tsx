"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, ThumbsUp, MessageCircle } from "lucide-react";
import { db,storage } from "@/firebaseConfig";
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode without braces
import { Timestamp } from "firebase/firestore"; // Import Timestamp

type Post = {
  id: string;
  author: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  timestamp: Timestamp; // Use Firestore Timestamp type
};

export default function PetShowcase() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<{ name: string } | null>(null);

  useEffect(() => {
    // Fetch posts from Firestore on component mount, ordered by timestamp
    const fetchPosts = async () => {
      const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(postsQuery);
      const loadedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(loadedPosts);
    };

    interface DecodedToken {
      email: string;
      // Add other fields from the token payload if needed
    }
    
    // Define the structure of your Firestore user data
    interface UserProfile {
      name: string;
      // Add other fields as needed
    }
    
    const fetchCurrentUserProfile = async () => {
      const token = localStorage.getItem("userToken");
    
      if (token) {
        try {
          // Decode the token using the DecodedToken interface
          const decodedData: DecodedToken = jwtDecode<DecodedToken>(token);
          const userEmail = decodedData.email;
    
          // Query Firestore to get the current user's profile based on email
          const userQuery = query(collection(db, "users"), where("email", "==", userEmail));
          const querySnapshot = await getDocs(userQuery);
    
          if (!querySnapshot.empty) {
            // Cast the document data to the UserProfile interface
            const userProfile = querySnapshot.docs[0].data() as UserProfile;
            setCurrentUserProfile(userProfile);
          } else {
            console.error("User profile not found in Firestore");
          }
        } catch (error) {
          console.error("Error decoding token or fetching user profile:", error);
        }
      } else {
        console.error("No token found in localStorage");
      }
    };

    fetchCurrentUserProfile();
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim() === "" && newImages.length === 0) return;

    // Ensure currentUserProfile is loaded before posting
    if (!currentUserProfile) {
      console.error("Current user profile is not loaded.");
      return;
    }

    // Upload images to Firebase Storage and get their URLs
    const uploadedImageUrls = await Promise.all(
      newImages.map(async (image) => {
        const storageRef = ref(storage, `posts/${Date.now()}-${image.name}`);
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      })
    );

    // Prepare post data with logged-in user name as author and current timestamp
    interface Post {
      id: string;
      author: string;
      content: string;
      images: string[];
      likes: number;
      comments: number;
      timestamp: Timestamp; // Ensure timestamp is of type Timestamp
    }
    
    const post: Omit<Post, "id"> = {
      author: currentUserProfile.name,
      content: newPost,
      images: uploadedImageUrls,
      likes: 0,
      comments: 0,
      timestamp: serverTimestamp() as Timestamp // Cast to Timestamp for type compatibility
    };
    try {
      const docRef = await addDoc(collection(db, "posts"), post);
      setPosts([{ id: docRef.id, ...post }, ...posts]); // Add the new post to state
    } catch (error) {
      console.error("Error adding post:", error);
    }

    setNewPost("");
    setNewImages([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const formatTimestamp = (timestamp: Timestamp | Date | number) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString(); // Correctly formats Firestore Timestamp
    }
    return new Date(timestamp).toLocaleString(); // Fallback for Date or number
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-8">Pet Showcase</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Share Your Pet&#39;s Achievement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <Textarea
              placeholder="What has your pet achieved?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-grow"
                multiple
              />
              <Button type="submit" className="bg-purple-600 text-white">
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={post.author} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{post.author}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{post.content}</p>
                {post.images &&
                  post.images.map((image, index) => (
                    <img key={index} src={image} alt="Pet achievement" className="w-32 h-32 object-cover rounded-lg mb-4" />
                  ))}
                <p className="text-sm text-gray-500 mt-2">{formatTimestamp(post.timestamp)}</p> {/* Display timestamp */}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
