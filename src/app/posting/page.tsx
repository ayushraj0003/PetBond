'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { PawPrint, Image as ImageIcon, Send, ThumbsUp, MessageCircle } from 'lucide-react'

type Post = {
  id: number
  author: string
  content: string
  images?: string[] // Array to hold multiple image URLs
  likes: number
  comments: number
}

export default function PetShowcase() {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [newImages, setNewImages] = useState<File[]>([]) // Array to hold selected images

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.trim() === '' && newImages.length === 0) return

    const post: Post = {
      id: Date.now(),
      author: 'Current User', // In a real app, this would come from authentication
      content: newPost,
      images: newImages.map((image) => URL.createObjectURL(image)),
      likes: 0,
      comments: 0,
    }

    setPosts([post, ...posts])
    setNewPost('')
    setNewImages([])
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files)) // Convert FileList to array
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-8">Pet Showcase</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Share Your Pet's Achievement</CardTitle>
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
                multiple // Enable multiple image selection
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
                {post.images && post.images.map((image, index) => (
                  <img key={index} src={image} alt="Pet achievement" className="w-32 h-32 object-cover rounded-lg mb-4" />
                ))}
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
  )
}
