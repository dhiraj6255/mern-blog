import { Card } from '@/components/ui/card'
import React, { useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setBlog } from '@/redux/blogSlice'
import { BsThreeDotsVertical } from 'react-icons/bs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const YourBlog = () => {

    const dispatch = useDispatch();
    const { blog } = useSelector(store => store.blog)
    const navigate = useNavigate()

    const getOwnBlog = async () => {
        try {
            const res = await axios.get('https://mern-blog-fvfo.onrender.com/api/v1/blog/get-own-blogs', { withCredentials: true })
            if (res.data.success) {
                dispatch(setBlog(res.data.blogs))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteBlog = async (id) => {
        try {
            const res = await axios.delete(`https://mern-blog-fvfo.onrender.com/api/v1/blog/delete/${id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id)
                dispatch(setBlog(updatedBlogData))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        getOwnBlog();
    }, [])

    const formateDate = (index) => {
        const date = new Date(blog[index].createdAt)
        const formattedDate = date.toLocaleDateString("en-GB")
        return formattedDate
    }

    return (
        <div className='pb-10 pt-20 md:ml-[320px] h-screen'>
            <div className="max-w-6xl mx-auto mt-8">
                <Card className='w-full p-5 space-y-2 dark:bg-gray-800'>
                    <Table>
                        <TableCaption>A list of your recent blogs.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className='text-center'>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blog.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="flex gap-4 items-center">
                                        <img src={item.thumbnail} className='w-20 rounded-md hidden md:block' alt="" />
                                        <h1 onClick={() => navigate(`/blogs/${item._id}`)} className='hover:underline cursor-pointer w-[60px] truncate md:w-full'>{item.title}</h1>
                                    </TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{formateDate(index)}</TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger><BsThreeDotsVertical className='cursor-pointer' /></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => navigate(`/dashboard/write-blog/${item._id}`)}><Edit />Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => deleteBlog(item._id)} className='text-red-500'><Trash2 className='text-red-500' />Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    )
}

export default YourBlog