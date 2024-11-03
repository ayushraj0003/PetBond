'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MessageCircleIcon, UserPlusIcon, UserCheckIcon, AlertCircle } from 'lucide-react'
import { DesktopSidebar, MobileSidebar, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import { db } from "@/firebaseConfig"
import { collection, getDocs, query, where, updateDoc, doc, Timestamp } from "firebase/firestore"
import { jwtDecode } from "jwt-decode"
import { Alert, AlertDescription } from "@/components/ui/alert"

type FriendRequest = {
  id: string
  senderId: string
  senderName: string
  senderEmail: string
  senderPetImage: string
  senderPetBreed: string
  senderPetAge: string
  senderPetType: string
  receiverId: string
  receiverName: string
  receiverEmail: string
  receiverPetImage: string
  receiverPetBreed: string
  receiverPetAge: string
  receiverPetType: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Timestamp
  matchPercentage: number
}

type Friend = {
  id: string
  name: string
  email: string
  petImage: string
  petBreed: string
  petAge: string
  petType: string
}

export default function FriendsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [friends, setFriends] = useState<Friend[]>([])
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([])
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserDataAndRequests = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("userToken")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const decodedData = jwtDecode(token) as { email: string }
        const userEmail = decodedData.email
        setCurrentUserEmail(userEmail)

        // First, get the current user's ID
        const userQuery = query(collection(db, "users"), where("email", "==", userEmail))
        const userSnapshot = await getDocs(userQuery)
        
        if (!userSnapshot.empty) {
          const userId = userSnapshot.docs[0].id
          setCurrentUserId(userId)

          // Fetch received friend requests
          const receivedRequestsQuery = query(
            collection(db, "friends"),
            where("receiverId", "==", userId),
            where("status", "==", "pending")
          )
          const receivedRequestsSnapshot = await getDocs(receivedRequestsQuery)
          const receivedRequestsData = receivedRequestsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as FriendRequest[]
          setReceivedRequests(receivedRequestsData)

          // Fetch sent friend requests
          const sentRequestsQuery = query(
            collection(db, "friends"),
            where("senderId", "==", userId),
            where("status", "==", "pending")
          )
          const sentRequestsSnapshot = await getDocs(sentRequestsQuery)
          const sentRequestsData = sentRequestsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as FriendRequest[]
          setSentRequests(sentRequestsData)

          // Fetch accepted friends
          const acceptedReceivedQuery = query(
            collection(db, "friends"),
            where("receiverId", "==", userId),
            where("status", "==", "accepted")
          )
          const acceptedSentQuery = query(
            collection(db, "friends"),
            where("senderId", "==", userId),
            where("status", "==", "accepted")
          )

          const [acceptedReceivedSnapshot, acceptedSentSnapshot] = await Promise.all([
            getDocs(acceptedReceivedQuery),
            getDocs(acceptedSentQuery)
          ])

          const acceptedFriends: Friend[] = []

          acceptedReceivedSnapshot.docs.forEach(doc => {
            const data = doc.data() as FriendRequest
            acceptedFriends.push({
              id: data.senderId,
              name: data.senderName,
              email: data.senderEmail,
              petImage: data.senderPetImage,
              petBreed: data.senderPetBreed,
              petAge: data.senderPetAge,
              petType: data.senderPetType
            })
          })

          acceptedSentSnapshot.docs.forEach(doc => {
            const data = doc.data() as FriendRequest
            acceptedFriends.push({
              id: data.receiverId,
              name: data.receiverName,
              email: data.receiverEmail,
              petImage: data.receiverPetImage,
              petBreed: data.receiverPetBreed,
              petAge: data.receiverPetAge,
              petType: data.receiverPetType
            })
          })

          setFriends(acceptedFriends)
        } else {
          throw new Error("User profile not found")
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load user data")
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserDataAndRequests()
  }, [])

  const handleAcceptFriendRequest = async (request: FriendRequest) => {
    if (!currentUserId) return

    try {
      const requestRef = doc(db, "friends", request.id)
      
      // Update the status in Firestore
      await updateDoc(requestRef, {
        status: "accepted"
      })

      // Update local state
      setReceivedRequests(prev => prev.filter(req => req.id !== request.id))
      
      // Add to friends list
      const newFriend: Friend = {
        id: request.senderId,
        name: request.senderName,
        email: request.senderEmail,
        petImage: request.senderPetImage,
        petBreed: request.senderPetBreed,
        petAge: request.senderPetAge,
        petType: request.senderPetType
      }
      setFriends(prev => [...prev, newFriend])
    } catch (error) {
      console.error("Error accepting friend request:", error)
      setError("Failed to accept friend request. Please try again.")
    }
  }

  const handleRejectFriendRequest = async (request: FriendRequest) => {
    if (!currentUserId) return

    try {
      const requestRef = doc(db, "friends", request.id)
      
      // Update the status in Firestore
      await updateDoc(requestRef, {
        status: "rejected"
      })

      // Update local state
      setReceivedRequests(prev => prev.filter(req => req.id !== request.id))
    } catch (error) {
      console.error("Error rejecting friend request:", error)
      setError("Failed to reject friend request. Please try again.")
    }
  }

  return (
    <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen}>
      <div className="flex min-h-screen bg-gradient-to-b from-pink-100 to-purple-200">
        <DesktopSidebar className="hidden lg:flex flex-col w-64 h-full fixed left-0 top-0 bg-white shadow-lg z-10">
          <SidebarLink link={{ label: "Home", href: "/", icon: <UserCheckIcon /> }} />
          <SidebarLink link={{ label: "Matchmaking", href: "/matchmaking", icon: <UserPlusIcon /> }} />
          <SidebarLink link={{ label: "Settings", href: "/settings", icon: <MessageCircleIcon /> }} />
        </DesktopSidebar>
  
        <MobileSidebar className="lg:hidden w-64" open={sidebarOpen} setOpen={setSidebarOpen}>
          <SidebarLink link={{ label: "Home", href: "/", icon: <UserCheckIcon /> }} />
          <SidebarLink link={{ label: "Matchmaking", href: "/matchmaking", icon: <UserPlusIcon /> }} />
          <SidebarLink link={{ label: "Settings", href: "/settings", icon: <MessageCircleIcon /> }} />
        </MobileSidebar>
  
        <div className="flex-1 flex flex-col items-center p-4 lg:ml-64">
          <h1 className="text-4xl font-bold text-purple-800 mb-8">PetBond Friends</h1>
  
          {error && (
            <Alert variant="destructive" className="mb-4 w-full max-w-4xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
  
          <div className="w-full max-w-4xl space-y-8">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center p-8"
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-800" />
                </motion.div>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Friend Requests
                        {receivedRequests.length > 0 && (
                          <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-semibold text-white bg-purple-600 rounded-full">
                            {receivedRequests.length}
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AnimatePresence>
                        {receivedRequests.length === 0 ? (
                          <p className="text-gray-500">No pending friend requests.</p>
                        ) : (
                          <ul className="space-y-4">
                            {receivedRequests.map((request) => (
                              <motion.li
                                key={request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center space-x-4">
                                  <Avatar>
                                    <AvatarImage src={request.senderPetImage} alt={request.senderName} />
                                    <AvatarFallback>{request.senderName[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold">{request.senderName}</p>
                                    <p className="text-sm text-gray-500">
                                      {request.senderPetBreed} ({request.senderPetAge} years)
                                    </p>
                                    <p className="text-xs text-purple-600">
                                      Match: {request.matchPercentage}%
                                    </p>
                                  </div>
                                </div>
                                <div className="space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAcceptFriendRequest(request)}
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRejectFriendRequest(request)}
                                    className="border-red-500 text-red-500 hover:bg-red-50"
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
  
                  {sentRequests.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Sent Requests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {sentRequests.map((request) => (
                            <motion.li
                              key={request.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
                            >
                              <div className="flex items-center space-x-4">
                                <Avatar>
                                  <AvatarImage src={request.receiverPetImage} alt={request.receiverName} />
                                  <AvatarFallback>{request.receiverName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold">{request.receiverName}</p>
                                  <p className="text-sm text-gray-500">
                                    {request.receiverPetBreed} ({request.receiverPetAge} years)
                                  </p>
                                  <p className="text-xs text-purple-600">
                                    Match: {request.matchPercentage}%
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">Pending</span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
  
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Friends ({friends.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AnimatePresence>
                        {friends.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">You haven't made any friends yet.</p>
                            <Button asChild variant="outline" className="hover:bg-purple-50">
                              <a href="/matchmaking">Start Matching!</a>
                            </Button>
                          </div>
                        ) : (
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {friends.map((friend) => (
                              <motion.li
                                key={friend.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center space-x-4">
                                  <Avatar>
                                    <AvatarImage src={friend.petImage} alt={friend.name} />
                                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold">{friend.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {friend.petBreed} ({friend.petAge} years)
                                    </p>
                                  </div>
                                </div>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                                >
                                  <MessageCircleIcon className="h-5 w-5" />
                                  <span className="sr-only">Chat with {friend.name}</span>
                                </Button>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
