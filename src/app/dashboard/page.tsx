'use client'
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { PawPrint, Home, Users, MessageCircle, ArrowLeft, ArrowRight, Heart } from 'lucide-react'
import { DesktopSidebar, MobileSidebar, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import { db } from "@/firebaseConfig"
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

const PetCard = ({ pet, owner }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className="relative w-48 h-48 mx-auto mb-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="w-full h-full rounded-full overflow-hidden border-4 border-purple-400 shadow-inner"
      >
        <Image
          src={pet.fileUrl}
          alt={pet.name}
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </motion.div>
    </div>
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-center space-y-2"
    >
      <h3 className="text-xl font-bold text-purple-800">{pet.name}</h3>
      <div className="space-y-1 text-gray-600">
        <p className="flex items-center justify-center gap-2">
          <PawPrint size={16} className="text-purple-500" />
          {pet.breed}
        </p>
        <p className="flex items-center justify-center gap-2">
          <Users size={16} className="text-purple-500" />
          {owner}
        </p>
        <p className="flex items-center justify-center gap-2">
          <Heart size={16} className="text-purple-500" />
          {pet.color}
        </p>
      </div>
    </motion.div>
  </motion.div>
);

const MatchAnimation = ({ profiles }) => (
  <motion.div
    className="relative w-64 h-64"
    animate={{ rotate: 360 }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
  >
    {profiles.map((profile, index) => (
      <motion.div
        key={profile.id}
        className="absolute"
        style={{
          width: '64px',
          height: '64px',
          top: '50%',
          left: '50%',
          marginLeft: '-32px',
          marginTop: '-32px',
          transformOrigin: '32px 96px',
          transform: `rotate(${index * (360 / profiles.length)}deg)`,
        }}
        whileHover={{ scale: 1.1 }}
      >
        <Image
          src={profile.pet.fileUrl}
          alt={profile.pet.name}
          width={64}
          height={64}
          className="rounded-full border-2 border-purple-300 shadow-lg"
        />
      </motion.div>
    ))}
  </motion.div>
);


export default function MatchmakingPage() {
  // State management
  const router = useRouter();

  const [isMatching, setIsMatching] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState(null)
  const [matchPercentage, setMatchPercentage] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userProfiles, setUserProfiles] = useState([])
  const [currentUserProfile, setCurrentUserProfile] = useState(null)
  const [matchedProfiles, setMatchedProfiles] = useState([])
  const [requestSent, setRequestSent] = useState(false)
  const [requestStatus, setRequestStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initial data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await Promise.all([fetchUserProfiles(), fetchCurrentUserProfile()])
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Fetch all user profiles
  const fetchUserProfiles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"))
      const profiles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setUserProfiles(profiles)
    } catch (error) {
      console.error("Error fetching user profiles:", error)
      throw new Error("Failed to fetch user profiles")
    }
  }

  // Fetch current user's profile
  const fetchCurrentUserProfile = async () => {
    try {
      const token = localStorage.getItem("userToken")
      if (!token) {
        throw new Error("No user token found")
      }

      const decodedData = jwtDecode(token)
      const userEmail = decodedData.email

      const userQuery = query(
        collection(db, "users"), 
        where("email", "==", userEmail)
      )
      const querySnapshot = await getDocs(userQuery)

      if (!querySnapshot.empty) {
        const userData = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data()
        }
        setCurrentUserProfile(userData)
      } else {
        throw new Error("User profile not found")
      }
    } catch (error) {
      console.error("Error fetching current user profile:", error)
      throw new Error("Failed to fetch current user profile")
    }
  }

  // Check if a friend request already exists
  const checkExistingRequest = async (senderId, receiverId) => {
    try {
      const requestQuery = query(
        collection(db, "friends"),
        where("senderId", "==", senderId),
        where("receiverId", "==", receiverId)
      )
      const querySnapshot = await getDocs(requestQuery)
      return !querySnapshot.empty
    } catch (error) {
      console.error("Error checking existing request:", error)
      throw new Error("Failed to check existing request")
    }
  }

  // Start the matching process
  const startMatching = () => {
    setIsMatching(true)
    setRequestStatus("")
    setTimeout(() => {
      findNewMatch()
    }, 3000)
  }

  // Find a new match and call the API
  const findNewMatch = () => {
    try {
      const availableProfiles = userProfiles.filter(profile => 
        !matchedProfiles.includes(profile.id) && 
        profile.id !== currentUserProfile?.id
      )

      if (availableProfiles.length > 0) {
        const randomProfile = availableProfiles[Math.floor(Math.random() * availableProfiles.length)]
        callMatchmakingApi(randomProfile)
      } else {
        setMatchedProfile(null)
        setMatchPercentage(null)
        setRequestStatus("No more matches available!")
      }
      setIsMatching(false)
      setRequestSent(false)
    } catch (error) {
      console.error("Error finding new match:", error)
      setRequestStatus("Error finding new match")
      setIsMatching(false)
    }
  }

  // Call the matchmaking API
  const callMatchmakingApi = async (matchedProfile) => {
    const data = {
      image1: currentUserProfile.pet?.fileUrl,
      image2: matchedProfile.pet.fileUrl
    };
    
    try {
      console.log("Sending request to API...");
      const response = await axios.post('http://127.0.0.1:5000/match', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Match response:", response.data.match_score);
      setMatchedProfile(matchedProfile);
      setMatchPercentage(response.data.match_score);
      setMatchedProfiles([...matchedProfiles, matchedProfile.id]);
    } catch (error) {
      console.error("Error sending request:", error.response || error.message);
      setRequestStatus("Error in matching process. Please try again.");
      setIsMatching(false);
    }
  };
  const handleLogout = () => {
    // Clear user authentication state
    localStorage.removeItem("userToken"); // Example: Remove the token from local storage

    // Redirect to the login page or home page after logout
    router.push("/auth");
  };
  // Handle skipping current match
  const handleSkipMatch = () => {
    setRequestStatus("")
    findNewMatch()
  }

  // Handle sending friend request
  const handleSendRequest = async () => {
    if (!currentUserProfile || !matchedProfile) {
      setRequestStatus("Error: User profiles not loaded")
      return
    }

    try {
      const requestExists = await checkExistingRequest(
        currentUserProfile.id, 
        matchedProfile.id
      )
      
      if (requestExists) {
        setRequestStatus("Friend request already sent!")
        setRequestSent(true)
        return
      }

      // Create the friend request document
      const friendRequest = {
        senderId: currentUserProfile.id,
        senderName: currentUserProfile.pet.name,
        senderEmail: currentUserProfile.email,
        senderPetType: currentUserProfile.pet.type,
        senderPetBreed: currentUserProfile.pet.breed,
        senderPetAge: currentUserProfile.pet.age,
        senderPetImage: currentUserProfile.pet.fileUrl,
        
        receiverId: matchedProfile.id,
        receiverName: matchedProfile.pet.name,
        receiverEmail: matchedProfile.email,
        receiverPetType: matchedProfile.pet.type,
        receiverPetBreed: matchedProfile.pet.breed,
        receiverPetAge: matchedProfile.pet.age,
        receiverPetImage: matchedProfile.pet.fileUrl,
        
        status: 'pending',
        matchPercentage: matchPercentage,
        createdAt: serverTimestamp(),
      }

      await addDoc(collection(db, "friends"), friendRequest)
      
      setRequestSent(true)
      setRequestStatus("Friend request sent successfully!")
      
      // Find new match after 2 seconds
      setTimeout(() => {
        findNewMatch()
      }, 2000)

    } catch (error) {
      console.error("Error sending friend request:", error)
      setRequestStatus("Error sending friend request")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-100 to-purple-200">
        <div className="text-2xl font-bold text-purple-800">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-100 to-purple-200">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen}>
      <div className="flex min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200">
        
      <DesktopSidebar className="hidden lg:flex flex-col w-64 h-full fixed left-0 top-0 bg-white/90 backdrop-blur-sm shadow-lg z-10" open={sidebarOpen} setOpen={setSidebarOpen}>
      <SidebarLink link={{ label: "Home", href: "/", icon: <Home className="text-purple-600" /> }} />
      <SidebarLink link={{ label: "Posts", href: "/posting", icon: <PawPrint className="text-purple-600" /> }} />
      <SidebarLink link={{ label: "Friends", href: "/friends", icon: <MessageCircle className="text-purple-600" /> }}/> 
      {/* <div
        onClick={handleLogout}
        className="cursor-pointer flex items-center space-x-2 text-purple-600 hover:text-purple-800"
      >
        <MessageCircle className="text-purple-600" />
        <span>LogOut</span>
      </div> */}
    </DesktopSidebar>

        <MobileSidebar className="lg:hidden w-64" open={sidebarOpen} setOpen={setSidebarOpen}>
          <SidebarLink link={{ label: "Home", href: "/", icon: <Home className="text-purple-600" /> }} />
          <SidebarLink link={{ label: "Posts", href: "/posting", icon: <PawPrint className="text-purple-600" /> }} />
          <SidebarLink link={{ label: "Friends", href: "/friends", icon: <MessageCircle className="text-purple-600" /> }} />
        </MobileSidebar>

        <div className="flex-1 flex flex-col items-center justify-center p-8 lg:ml-64">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold text-purple-800 mb-12 text-center"
          >
            PetBond Matchmaking
          </motion.h1>

          <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {currentUserProfile && (
                  <PetCard 
                    pet={currentUserProfile.pet}
                    owner={currentUserProfile.name}
                  />
                )}

                <div className="flex flex-col items-center justify-center">
                  {!isMatching && !matchedProfile && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={startMatching}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg"
                      >
                        Start Matching
                      </Button>
                    </motion.div>
                  )}

                  {isMatching && <MatchAnimation profiles={userProfiles} />}

                  {matchedProfile && !isMatching && (
                    <PetCard 
                      pet={matchedProfile.pet}
                      owner={matchedProfile.name}
                    />
                  )}
                </div>
              </div>

              {matchedProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="inline-flex items-center justify-center bg-pink-100 rounded-full px-6 py-3 mb-6"
                  >
                    <Heart className="text-pink-500 w-6 h-6 mr-2" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {matchPercentage}% Match
                    </span>
                  </motion.div>

                  {requestStatus && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-purple-600 mb-4"
                    >
                      {requestStatus}
                    </motion.p>
                  )}

                  <div className="flex justify-center space-x-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSkipMatch}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-4 shadow-md"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSendRequest}
                      disabled={requestSent}
                      className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-full p-4 shadow-md disabled:opacity-50"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}