import BlogCard from '@/components/BlogCard'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const SearchList = () => {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const query = params.get('q') || ''
    const { blog } = useSelector(store => store.blog)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const filteredBlog = blog
        ? blog.filter((blog) =>
            blog.title.toLowerCase().includes(query.toLowerCase()) ||
            blog.subtitle.toLowerCase().includes(query.toLowerCase()) ||
            blog.category.toLowerCase() === query.toLowerCase()
        )
        : []

    return (
        <div className='pt-32 px-4'>
            <div className="max-w-6xl mx-auto">
                <h2 className="text-xl font-semibold mb-5">Search result for: "<span className="text-red-500">{query}</span>"</h2>

                {
                    filteredBlog.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 my-10">
                            {filteredBlog.map((blog, index) => (
                                <BlogCard key={blog._id || index} blog={blog} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center my-20">
                            No blogs found matching "<span className="text-red-500">{query}</span>"
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default SearchList
