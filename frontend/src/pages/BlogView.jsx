import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { Bookmark, MessageSquare, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { setBlog } from '@/redux/blogSlice'
import CommentBox from '@/components/CommentBox'

const BlogView = () => {
    const { blogId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { blog } = useSelector(store => store.blog)
    const { user } = useSelector(store => store.auth)

    const selectedBlog = blog?.find(blog => blog._id === blogId)

    const [blogLike, setBlogLike] = useState(0)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        if (!user) {
            toast.error("Please login to view the blog")
            navigate("/login")
            return
        }

        if (!selectedBlog) {
            toast.error("Blog not found or you're not authorized")
        } else {
            setBlogLike(selectedBlog.likes.length)
            setLiked(selectedBlog.likes.includes(user._id))
        }

        window.scrollTo(0, 0)
    }, [navigate])

    const changeTimeFormat = (isDate) => {
        const date = new Date(isDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options)
    }

    const handleShare = (blogId) => {
        const blogUrl = `${window.location.origin}/blogs/${blogId}`
        if (navigator.share) {
            navigator.share({
                title: 'Check out this blog!',
                text: 'Read this amazing blog post',
                url: blogUrl,
            }).then(() => console.log('shared successfully')
            ).catch((err) => console.error('Error Sharing:', err))
        } else {
            navigator.clipboard.writeText(blogUrl).then(() => {
                toast.success('Blog Link copied to clipboard')
            })
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? "dislike" : "like"
            const res = await axios.get(`http://localhost:8000/api/v1/blog/${selectedBlog._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedLikes = liked ? blogLike - 1 : blogLike + 1
                setBlogLike(updatedLikes)
                setLiked(!liked)

                const updatedBlogData = blog.map(p =>
                    p._id === selectedBlog._id
                        ? { ...p, likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id] }
                        : p
                )
                toast.success(res.data.message)
                dispatch(setBlog(updatedBlogData))
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    if (!user || !selectedBlog) {
        return <p className='text-center mt-20 text-red-500'>Unauthorized or blog not found</p>
    }

    return (
        <div className='pt-14'>
            <div className="max-w-6xl mx-auto p-10">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to='/'>Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link to='/blogs'>Blogs</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="my-8">
                    <h1 className='text-4xl font-bold tracking-tight mb-4'>{selectedBlog.title}</h1>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={selectedBlog.author.photoUrl} alt='author' />
                                <AvatarFallback>DB</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className='font-medium'>{selectedBlog.author.firstName} {selectedBlog.author.lastName}</p>
                            </div>
                        </div>
                        <p className='text-sm text-muted-foreground'>Published on {changeTimeFormat(selectedBlog.createdAt)} • 8 min read</p>
                    </div>
                </div>

                <div className="mb-8 rounded-lg overflow-hidden">
                    <img src={selectedBlog.thumbnail} alt="thumbnail" width={1000} height={500} className='w-full object-cover' />
                    <p className='text-sm text-muted-foreground mt-2 italic'>{selectedBlog.subtitle}</p>
                </div>

                <p dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />

                <div className="mt-10">
                    <div className="flex flex-wrap gap-2 mb-8">
                        <Badge variant="secondary" className="dark:bg-gray-800">Next.js</Badge>
                        <Badge variant="secondary" className="dark:bg-gray-800">React</Badge>
                        <Badge variant="secondary" className="dark:bg-gray-800">Web Development</Badge>
                        <Badge variant="secondary" className="dark:bg-gray-800">JavaScript</Badge>
                    </div>

                    <div className="flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8">
                        <div className="flex items-center space-x-4">
                            <Button onClick={likeOrDislikeHandler} variant='ghost' className="flex items-center gap-1">
                                {
                                    liked
                                        ? <FaHeart size={24} className='cursor-pointer text-red-600' />
                                        : <FaRegHeart size={24} className='cursor-pointer hover:text-gray-600' />
                                }
                                <span>{blogLike}</span>
                            </Button>
                            <Button variant='ghost' size='sm'>
                                <MessageSquare className='h-4 w-4' />
                                <span>1 Comments</span>
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant='ghost' size='sm'>
                                <Bookmark className='h-4 w-4' />
                            </Button>
                            <Button onClick={() => handleShare(selectedBlog._id)} variant='ghost' size='sm'>
                                <Share2 className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                </div>

                <CommentBox selectedBlog={selectedBlog} />
            </div>
        </div>
    )
}

export default BlogView
