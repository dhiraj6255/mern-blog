import React from 'react'
import Hero from '../components/Hero'
import RecentBlogs from '@/components/RecentBlogs'
import PopularAuthors from '@/components/PopularAuthors'

const Home = () => {
    return (
        <div className='flex flex-col justify-center pt-20 min-h-screen'>
            <Hero />
            <RecentBlogs />
            <PopularAuthors />
        </div>
    )
}

export default Home