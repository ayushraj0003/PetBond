'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { HeartIcon } from 'lucide-react'
import { DesktopSidebar, MobileSidebar, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import { db } from "@/firebaseConfig"
import { collection, getDocs, query, where } from "firebase/firestore"
import { jwtDecode } from "jwt-decode"

export default function MatchmakingPage() {
  const [isMatching, setIsMatching] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState(null)
  const [matchPercentage, setMatchPercentage] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userProfiles, setUserProfiles] = useState([])
  const [currentUserProfile, setCurrentUserProfile] = useState(null)

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserProfiles = async () => {
      const querySnapshot = await getDocs(collection(db, "users"))
      const profiles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setUserProfiles(profiles)
    }
    
    const fetchCurrentUserProfile = async () => {
      const token = localStorage.getItem("userToken")
      if (token) {
        const decodedData = jwtDecode(token)
        const userEmail = decodedData.email
        console.log("Decoded email:", userEmail)

        // Query Firestore to get the current user's profile based on email
        const userQuery = query(collection(db, "users"), where("email", "==", userEmail))
        const querySnapshot = await getDocs(userQuery)
        
        if (!querySnapshot.empty) {
          setCurrentUserProfile(querySnapshot.docs[0].data())
        } else {
          console.error("User profile not found in Firestore")
        }
      }
    }

    fetchUserProfiles()
    fetchCurrentUserProfile()
  }, [])

  const startMatching = () => {
    setIsMatching(true)
    setTimeout(() => {
      const randomProfile = userProfiles[Math.floor(Math.random() * userProfiles.length)]
      const randomPercentage = Math.floor(Math.random() * (100 - 70 + 1) + 70)
      setMatchedProfile(randomProfile)
      setMatchPercentage(randomPercentage)
      setIsMatching(false)
    }, 3000)
  }

  return (
    <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen}>
      <div className="flex min-h-screen bg-gradient-to-b from-pink-100 to-purple-200">
        
        {/* Sidebar */}
        <DesktopSidebar className="hidden lg:flex flex-col w-64 h-full fixed left-0 top-0 bg-white shadow-lg z-10" open={sidebarOpen} setOpen={setSidebarOpen}>
          <SidebarLink link={{ label: "Home", href: "/", icon: <HeartIcon /> }} />
          <SidebarLink link={{ label: "Posting", href: "/posting", icon: <HeartIcon/> }} />
          <SidebarLink link={{ label: "Settings", href: "/settings", icon: <HeartIcon /> }} />
        </DesktopSidebar>

        <MobileSidebar className="lg:hidden w-64" open={sidebarOpen} setOpen={setSidebarOpen}>
          <SidebarLink link={{ label: "Home", href: "/", icon: <HeartIcon /> }} />
          <SidebarLink link={{ label: "Profile", href: "/profile", icon: <HeartIcon /> }} />
          <SidebarLink link={{ label: "Settings", href: "/settings", icon: <HeartIcon /> }} />
        </MobileSidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 ml-64">
          <h1 className="text-4xl font-bold text-purple-800 mb-8">PetBond Matchmaking</h1>

          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="mb-4 md:mb-0">
                {currentUserProfile && currentUserProfile.pet?.fileUrl ? (
                  <Image
                    src={currentUserProfile.pet.fileUrl} // Use current user's pet image
                    alt="Your profile"
                    width={200}
                    height={200}
                    className="rounded-full border-4 border-purple-500"
                  />
                ) : (
                  <p className="text-center mt-2 text-lg font-semibold">Your Pet</p>
                )}
              </div>

              {!isMatching && !matchedProfile && (
                <Button
                  onClick={startMatching}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Start Matching
                </Button>
              )}

              {(isMatching || matchedProfile) && (
                <div className="relative w-64 h-64">
                  <AnimatePresence>
                    {isMatching && (
                      <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        {userProfiles.map((profile, index) => (
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
                              transform: `rotate(${index * 45}deg)`,
                            }}
                          >
                            <Image
                              src={profile.pet.fileUrl}
                              alt={profile.pet.name}
                              width={64}
                              height={64}
                              className="rounded-full"
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {matchedProfile && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Image
                        src={matchedProfile.pet.fileUrl}
                        alt={matchedProfile.pet.name}
                        width={200}
                        height={200}
                        className="rounded-full border-4 border-pink-500"
                      />
                      <div className="text-center mt-4">
                        <p className="text-lg font-bold">{matchedProfile.pet.name}</p>
                        <p className="text-md text-gray-700">{matchedProfile.pet.breed}, Age: {matchedProfile.pet.age}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {matchedProfile && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-purple-800 mb-4">It's a Match!</h2>
                <div className="flex items-center justify-center mb-4">
                  <HeartIcon className="text-pink-500 w-8 h-8 mr-2" />
                  <span className="text-3xl font-bold text-pink-500">{matchPercentage}% Match</span>
                </div>
                <p className="text-lg text-gray-600">You and your new furry friend seem to be a great match! Why not arrange a playdate?</p>
                <Button
                  onClick={() => {
                    setMatchedProfile(null)
                    setMatchPercentage(null)
                  }}
                  className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Find Another Match
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
