import React from 'react'
import NavBar from '../Components/NavBar'
import Hero from '../Components/Hero'
import Advertiestment from '../Components/Advertiestment'
import AboutUs from '../Components/AboutUs'
import ContactUs from '../Components/ContactUs'
import Footer from '../Components/Footer'
import PreschoolPreview from '../Components/PreSchoolPreview'
import YouTube from '../Components/YouTube'

const Home = () => {
  return (
    <div className='relative bg-purple-200/50'>
        <NavBar/>
        <Hero/>
       <section id="about">
 <AboutUs/>
       </section>
       <PreschoolPreview/>
         <Advertiestment/>
         <YouTube/>
         <section id="contact">
 <ContactUs/>
         </section>
       
        <Footer/>
    </div>
  )
}

export default Home