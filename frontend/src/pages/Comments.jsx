import { Card } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
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
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Comments = () => {

    const navigate = useNavigate()
    const [allComments, setAllComments] = useState([])

    const getTotalComments = async () => {
        try {
            const res = await axios.get(`https://mern-blog-axdb.onrender.com/api/v1/comment/my-blog/comments`, { withCredentials: true })
            if (res.data.success) {
                setAllComments(res.data.comments)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTotalComments()
    }, [])


    return (
        <div className='pb-10 pt-20 md:ml-[320px] h-screen'>
            <div className="max-w-6xl mx-auto mt-8">
                <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
                    <Table>
                        <TableCaption>A list of your recent Comments.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Blog Title</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allComments.map((comment, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        <h1 className='w-[60px] truncate md:w-full'>{comment.postId.title}</h1>
                                    </TableCell>
                                    <TableCell>{comment.content}</TableCell>
                                    <TableCell>{comment.userId.firstName}</TableCell>
                                    <TableCell>
                                        <Eye className='cursor-pointer' onClick={() => navigate(`/blogs/${comment.postId._id}`)} />
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

export default Comments