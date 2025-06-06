import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { setBlog, setLoading } from '@/redux/blogSlice'
import { Loader2 } from 'lucide-react'

const CreateBlog = () => {
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { blog, loading } = useSelector(store => store.blog)

    const getSelectedCategaory = (value) => {
        setCategory(value)
    }

    const createBlogHandler = async () => {
        try {
            dispatch(setLoading(true));

            const res = await axios.post('https://mern-blog-fvfo.onrender.com/api/v1/blog/',
                { title, category },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                const newBlog = res.data.blog;

                // Navigate first to the blog editing page
                navigate(`/dashboard/write-blog/${newBlog._id}`);
                toast.success(res.data.message);

                // Update blog state safely
                if (!blog || !Array.isArray(blog)) {
                    dispatch(setBlog([newBlog]));
                } else {
                    dispatch(setBlog([...blog, newBlog]));
                }
            } else {
                toast.error("Something went wrong");
            }

        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("You are not authorized. Please login.");
            } else {
                toast.error(error.response?.data?.message || error.message);
            }
            console.error("Create blog error:", error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className='p-4 md:pr-20 h-screen md:ml-[320px] pt-20' >
            <Card className="md:p-10 p-4 dark:bg-gray-800 -space-y-6">
                <h1 className='text-2xl font-bold'>Let's create blog</h1>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid temporibus perspiciatis tempora dolore maiores ab qui reiciendis ut iusto minus!</p>
                <div className="mt-10">
                    <div>
                        <Label>Title</Label>
                        <Input type="text" placeholder="Your blog name" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white dark:bg-gray-700 mt-1" />
                    </div>
                    <div className="mt-4 mb-5">
                        <Label className="mb-1">Category</Label>
                        <Select onValueChange={getSelectedCategaory}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    <SelectItem value="Web Development">Web Development</SelectItem>
                                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                                    <SelectItem value="Blogging">Blogging</SelectItem>
                                    <SelectItem value="Photography">Photography</SelectItem>
                                    <SelectItem value="Cooking">Cooking</SelectItem>
                                    <SelectItem value="Traveling">Traveling</SelectItem>
                                    <SelectItem value="Sports">Sports</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <Button disabled={loading} onClick={createBlogHandler}>
                            {
                                loading ? <><Loader2 className='mr-1 h-4 w-4 animate-spin' />Please wait</> : "Create"
                            }
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default CreateBlog 