'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { HeartIcon, PawPrintIcon, LogOutIcon, UserIcon, SettingsIcon } from 'lucide-react'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'
import { SidebarProvider, Sidebar, SidebarBody } from '@/components/ui/sidebar'

const petData = [
  { id: 1, name: 'Buddy', image: '/Images/dog.jpeg', color: 'Golden', breed: 'Labrador', matchScore: 95 },
  { id: 2, name: 'Whiskers', image: '/Images/cat2.jpeg', color: 'Gray', breed: 'Persian', matchScore: 88 },
  { id: 3, name: 'Max', image: '/Images/cat.jpeg', color: 'Orange', breed: 'Tabby', matchScore: 92 },
  { id: 4, name: 'Luna', image: '/Images/cat3.jpeg', color: 'Black', breed: 'Siamese', matchScore: 90 },
]

const Dial = ({ isSpinning, onStop }) => {
  const [rotation, setRotation] = useState(0)
  const [selectedPet, setSelectedPet] = useState(null)

  useEffect(() => {
    let interval
    if (isSpinning) {
      interval = setInterval(() => {
        setRotation((prev) => (prev + 10) % 360)
      }, 50)
    } else if (selectedPet === null) {
      const randomIndex = Math.floor(Math.random() * petData.length)
      setSelectedPet(petData[randomIndex])
      onStop(petData[randomIndex])
    }
    return () => clearInterval(interval)
  }, [isSpinning, onStop, selectedPet])

  return (
    <div className="relative w-80 h-80">
      <motion.div
        className="w-full h-full rounded-full border-8 border-purple-500 shadow-lg"
        style={{ rotate: rotation }}
      >
        {petData.map((pet, index) => (
          <React.Fragment key={pet.id}>
            <motion.img
              src={pet.image}
              alt={pet.name}
              className="absolute w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              style={{
                top: `${50 - 45 * Math.cos((index * Math.PI * 2) / petData.length)}%`,
                left: `${50 + 45 * Math.sin((index * Math.PI * 2) / petData.length)}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-full h-0.5 bg-purple-300 origin-left"
              style={{
                transform: `rotate(${(index * 360) / petData.length}deg)`,
              }}
            />
          </React.Fragment>
        ))}
      </motion.div>
      <div className="absolute top-0 left-1/2 w-4 h-12 bg-black rounded-b-full shadow-md transform -translate-x-1/2 z-10">
        <div className="w-full h-full bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700 rounded-b-full" />
      </div>
    </div>
  )
}

const MatchResult = ({ pet }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white p-4 rounded-lg shadow-lg"
  >
    <h3 className="text-xl font-bold mb-2">{pet.name}</h3>
    <p>Color: {pet.color}</p>
    <p>Breed: {pet.breed}</p>
    <p className="text-lg font-semibold mt-2">Match Score: {pet.matchScore}%</p>
  </motion.div>
)

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMatchmaking, setIsMatchmaking] = useState(false)
  const [matchedPet, setMatchedPet] = useState(null)
  const controls = useAnimation()

  useEffect(() => {
    setIsLoaded(true)
    controls.start('visible')
  }, [controls])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  const handleMatchmaking = () => {
    setIsMatchmaking(true)
    setMatchedPet(null)
    setTimeout(() => setIsMatchmaking(false), 3000)
  }

  const handleMatchmakingStop = (pet) => {
    setMatchedPet(pet)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <Sidebar className="w-1/4 bg-purple-100 p-4 flex flex-col">
          <SidebarBody>
            <h2 className="text-2xl font-semibold mb-4">Options</h2>
            <div className="space-y-4">
              <Button
                onClick={() => alert("Profile clicked")}
                className="flex items-center space-x-2 bg-purple-500 text-white w-full rounded-lg p-2 hover:bg-purple-600 transition"
              >
                <UserIcon className="w-5 h-5" />
                <span>Profile</span>
              </Button>
              <Button
                onClick={() => alert("Settings clicked")}
                className="flex items-center space-x-2 bg-purple-500 text-white w-full rounded-lg p-2 hover:bg-purple-600 transition"
              >
                <SettingsIcon className="w-5 h-5" />
                <span>Settings</span>
              </Button>
              <Button
                onClick={() => alert("Logout clicked")}
                className="flex items-center space-x-2 bg-purple-500 text-white w-full rounded-lg p-2 hover:bg-purple-600 transition"
              >
                <LogOutIcon className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </div>
          </SidebarBody>
        </Sidebar>

        <div className="flex-1 bg-gradient-to-b from-pink-100 to-purple-200 flex flex-col justify-center items-center p-4">
          <motion.div
            className="text-center"
            initial="hidden"
            animate={controls}
            variants={containerVariants}
          >
            <motion.div className="mb-8" variants={itemVariants}>
              <h1 className="text-4xl md:text-6xl font-bold text-purple-800 mb-2">
                PetBond
              </h1>
              <p className="text-xl md:text-2xl text-purple-600">
                Find your pet's perfect match!
              </p>
            </motion.div>

            <div className="flex justify-center items-center space-x-8">
              <motion.div 
                className="relative w-64 h-64 md:w-80 md:h-80" 
                variants={itemVariants}
                animate={isMatchmaking ? { x: -100 } : { x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardContainer className="rounded-full shadow-lg" containerClassName="flex items-center justify-center">
                  <CardBody>
                    <CardItem
                      className="rounded-full overflow-hidden shadow-lg"
                      translateX={0}
                      translateY={0}
                      translateZ={20}
                      rotateX="15deg"
                      rotateY="15deg"
                      rotateZ="5deg"
                    >
                      <img
                        src='/Images/dog.jpeg'
                        alt="Your pet"
                        width="320"
                        height="320"
                        className="w-full h-full object-cover"
                      />
                    </CardItem>
                  </CardBody>
                </CardContainer>

                <motion.div
                  className="absolute -top-4 -left-4 bg-pink-400 rounded-full p-3"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HeartIcon className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -right-4 bg-purple-400 rounded-full p-3"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <PawPrintIcon className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>

              <AnimatePresence>
                {isMatchmaking && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="ml-8" // Add some margin to separate from the pet image
                  >
                    <Dial isSpinning={isMatchmaking} onStop={handleMatchmakingStop} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {matchedPet && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8"
                >
                  <MatchResult pet={matchedPet} />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="mt-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                onClick={handleMatchmaking}
                disabled={isMatchmaking}
              >
                <motion.span
                  className="inline-block"
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                    times: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
                    loop: Infinity,
                    repeatDelay: 2
                  }}
                >
                  🐾
                </motion.span>
                {isMatchmaking ? 'Matchmaking...' : 'Start Matchmaking'}
              </Button>
            </motion.div>

            <motion.div
              className="mt-8 space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {['Find playdates', 'Make new friends', 'Discover pet-friendly spots'].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center justify-center space-x-2"
                >
                  <PawPrintIcon className="w-5 h-5 text-purple-500" />
                  <span className="text-purple-700">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SidebarProvider>
  )
}