'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useAnimation } from 'framer-motion'
import { HeartIcon, ChatBubbleBottomCenterTextIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { FloatingNav } from '@/components/ui/floating-navbar'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card' 
export default function PetBondLanding() {
  const router =useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 }
    }))
  }, [controls])
const handleDash =()=>{
  const token = localStorage.getItem("userToken")
  if(token){
    router.push("/dashboard")
  }else{
    router.push("/auth")
  }
}
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-200">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-3xl font-bold text-purple-600">PetBond</div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-purple-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          <ul className={`md:flex space-x-6 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <li><a href="/auth" className="text-purple-600 hover:text-purple-800">SignUp</a></li>
            <li><a href="/auth" className="text-purple-600 hover:text-purple-800">Login</a></li>
            <li><a href="#features" className="text-purple-600 hover:text-purple-800">Features</a></li>
          </ul>
        </nav>
      </header>
              <FloatingNav/>
      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold text-purple-800 mb-6"
          >
            Find Your Pet&#39;s Perfect Match
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-purple-600 mb-10"
          >
            Connect, play, and bond with other pets in your area
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={handleDash}
              
              className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300"
            >
              Get Started
            </button>
          </motion.div>
        </section>

        <section id="features" className="container mx-auto px-4 py-20">
  <h2 className="text-6xl font-bold text-purple-800 text-center mb-12">Why Choose PetBond?</h2>
  <div className="grid md:grid-cols-3 gap-8">
    {[
      {
        icon: HeartIcon,
        title: "Match with Compatible Pets",
        description: "Our algorithm finds the perfect playmates for your furry friend",
      },
      {
        icon: ChatBubbleBottomCenterTextIcon,
        title: "Chat and Plan Meetups",
        description: "Easily communicate with other pet owners and arrange playdates",
      },
      {
        icon: MapPinIcon,
        title: "Make Friends for Your Pets",
        description: "Find friends for your pets, arrange playdates, and share tips for a happier, healthier life.",
      },
    ].map((feature, index) => (
      <CardContainer
        key={index}
        className="relative hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
        containerClassName="perspective-1000"
      >
        <CardBody className="bg-white p-6 rounded-lg shadow-lg text-center">
          <CardItem
            as="div"
            translateX="0px"
            translateY="0px"
            translateZ="20px"
            rotateX="10deg"
            rotateY="10deg"
            rotateZ="0deg"
            className="flex flex-col items-center"
          >
            <feature.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-3xl font-semibold text-purple-800 mb-2">{feature.title}</h3>
            <p className="text-xl text-purple-600">{feature.description}</p>
          </CardItem>
        </CardBody>
      </CardContainer>
    ))}
  </div>
</section>



        <section id="how-it-works" className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-bold text-purple-800 mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            {[
              { step: 1, text: "Create a profile for your pet" },
              { step: 2, text: "Browse and match with other pets" },
              { step: 3, text: "Chat and arrange meetups" },
              { step: 4, text: "Enjoy playdates and make new friends!" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <p className="text-purple-800 font-semibold">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="download" className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-bold text-purple-800 mb-6">Ready to Find Your Pet&#39;s Soulmate?</h2>
          <p className="text-xl text-purple-600 mb-10">Download PetBond now and start making connections!</p>
          <div className="flex justify-center space-x-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition duration-300 flex items-center"
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 384 512">
                <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              Download for iOS
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center"
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 512 512">
                <path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
              </svg>
              Download for Android
            </motion.a>
          </div>
        </section>
      </main>

      <footer className="bg-purple-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 PetBond. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="text-white hover:text-pink-200 mx-2">Privacy Policy</a>
            <a href="#" className="text-white hover:text-pink-200 mx-2">Terms of Service</a>
            <a href="#" className="text-white hover:text-pink-200 mx-2">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  )
}