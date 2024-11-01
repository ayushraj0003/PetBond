'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { HeartIcon, PawPrintIcon } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
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

  const floatingAnimation = {
    y: ['-10%', '10%'],
    transition: {
      y: {
        duration: 2,
        yoyo: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 flex flex-col justify-center items-center p-4">
      <motion.div
        className="text-center"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-purple-800 mb-2">
            PetBond
          </h1>
          <p className="text-xl md:text-2xl text-purple-600">
            Find your pet's perfect match!
          </p>
        </motion.div>

        <motion.div
          className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="absolute inset-0"
            animate={floatingAnimation}
          >
            <Image
              src="/placeholder.svg?height=320&width=320"
              alt="Cute pets"
              width={320}
              height={320}
              className="rounded-full shadow-lg"
            />
          </motion.div>
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

        <motion.div variants={itemVariants}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
            onClick={() => console.log('Start matchmaking')}
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
            Start Matchmaking
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
  )
}