import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { LuSend } from 'react-icons/lu'
import axios from 'axios'
import { setComment } from '@/redux/commentSlice'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { toast } from 'sonner'
import { setBlog } from '@/redux/blogSlice'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDots } from 'react-icons/bs'
import { Edit, Trash2 } from 'lucide-react'

const CommentBox = ({ selectedBlog }) => {

    const { user } = useSelector(store => store.auth)
    const { comment } = useSelector(store => store.comment)
    const { blog } = useSelector(store => store.blog)
    const [content, setContent] = useState("")
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editedContent, setEditedContent] = useState("")
    const [parentId, setParentId] = useState(null)
    const dispatch = useDispatch()

    const changeEventHandler = (e) => {
        const inputText = e.target.value
        if (inputText.trim()) {
            setContent(inputText)
        } else {
            setContent("")
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`https://mern-blog-axdb.onrender.com/api/v1/comment/${selectedBlog._id}/create`, {
                content,
                parentId
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })

            if (res.data.success) {
                let updatedCommentData
                if (comment.length >= 1) {
                    updatedCommentData = [...comment, res.data.comment]
                } else {
                    updatedCommentData = [res.data.comment]
                }
                dispatch(setComment(updatedCommentData))

                const updatedBlogData = blog.map(blog =>
                    blog._id === selectedBlog._id
                        ? { ...blog, comments: updatedCommentData }
                        : blog
                )
                dispatch(setBlog(updatedBlogData))
                toast.success(res.data.message)
                setContent("")
                setParentId(null)
            }
        } catch (error) {
            console.log(error)
            toast.error("Comment not added")
        }
    }

    const deleteComment = async (commentId) => {
        try {
            const res = await axios.delete(`https://mern-blog-axdb.onrender.com/api/v1/comment/${commentId}/delete`, {
                withCredentials: true
            })
            if (res.data.success) {
                const updatedCommentData = comment.filter((item) => item._id !== commentId)
                dispatch(setComment(updatedCommentData))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Comment not deleted")
        }
    }

    const editCommentHandler = async (commentId) => {
        try {
            const res = await axios.put(`https://mern-blog-axdb.onrender.com/api/v1/comment/${commentId}/edit`, { content: editedContent }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (res.data.success) {
                const updatedCommentData = comment.map(item => {
                    if (item._id === commentId) {
                        return { ...item, content: editedContent }
                    }
                    return item
                })

                dispatch(setComment(updatedCommentData))
                toast.success(res.data.message)
                setEditingCommentId(null)
                setEditedContent("")
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to edit comment")
        }
    }

    const likeCommentHandler = async (commentId) => {
        try {
            const res = await axios.get(`https://mern-blog-axdb.onrender.com/api/v1/comment/${commentId}/like`, {
                withCredentials: true
            });
            if (res.data.success) {
                const updatedComment = res.data.updatedComment;

                const updatedCommentList = comment.map(item =>
                    item._id === commentId ? updatedComment : item
                );
                dispatch(setComment(updatedCommentList))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.error("Error liking comment", error)
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        const getAllCommentsOfBlogs = async () => {
            try {
                const res = await axios.get(`https://mern-blog-axdb.onrender.com/api/v1/comment/${selectedBlog._id}/comment/all`)
                const data = res.data.comments
                dispatch(setComment(data))
            } catch (error) {
                console.log(error)
            }
        }
        getAllCommentsOfBlogs()
    }, [])

    return (
        <div>
            <div className="flex gap-4 mb-4 items-center">
                <Avatar>
                    <AvatarImage src={user.photoUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h3 className='font-semibold'>{user.firstName} {user.lastName}</h3>
            </div>
            <div className="flex gap-3">
                <Textarea
                    placeholder="Leave a comment"
                    className="bg-gray-100 dark:bg-gray-800"
                    value={content}
                    onChange={changeEventHandler}
                />
                <Button onClick={commentHandler} disabled={!content.trim()}>
                    <LuSend />
                </Button>
            </div>
            {
                (comment || []).length > 0 ? <div className='mt-7 bg-gray-100 dark:bg-gray-800 p-5 rounded-md'>
                    {
                        comment.map((item, index) => {
                            return <div key={index} className='mb-4'>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-3 items-start">
                                        <Avatar>
                                            <AvatarImage src={item?.userId?.photoUrl} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className="mb-2 space-y-1 md:w-[400px]">
                                            <h1 className='font-semibold'>{item?.userId?.firstName} {item?.userId?.lastName} <span className='text-sm ml-2 font-light'>{new Date(item?.createdAt).toLocaleString('en-IN', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}</span></h1>
                                            {
                                                editingCommentId === item?._id ? (
                                                    <>
                                                        <Textarea
                                                            value={editedContent}
                                                            onChange={(e) => setEditedContent(e.target.value)}
                                                            className="mb-2 bg-gray-200 dark:bg-gray-700"
                                                        />
                                                        <div className='flex py-1 gap-2'>
                                                            <Button onClick={() => editCommentHandler(item._id)}>
                                                                Save
                                                            </Button>
                                                            <Button variant="outline" onClick={() => setEditingCommentId(null)}>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </>
                                                ) : <p>{item?.content}</p>
                                            }
                                            <div className="flex gap-5 items-center">
                                                <div className="flex gap-2 items-center">
                                                    <div onClick={() => likeCommentHandler(item._id)} className="flex gap-1 items-center cursor-pointer">
                                                        {
                                                            item.likes.includes(user._id) ? <FaHeart fill='red' /> : <FaRegHeart />
                                                        }
                                                        <span>{item?.numberOfLikes}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setParentId(item._id)
                                                            setContent(`@${item.userId.firstName} ${item.userId.lastName} : `)
                                                        }}
                                                    >
                                                        Reply
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        user._id === item?.userId?._id ? <DropdownMenu>
                                            <DropdownMenuTrigger className="cursor-pointer"><BsThreeDots /></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => {
                                                    setEditingCommentId(item._id)
                                                    setEditedContent(item.content)
                                                }}><Edit />Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => deleteComment(item._id)} className="text-red-500"><Trash2 className='text-red-500' />Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu> : null
                                    }
                                </div>
                            </div>
                        })
                    }
                </div> : null
            }
        </div>
    )
}

export default CommentBox