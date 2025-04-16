import React, { useEffect } from 'react'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Scale,
    Users,
    Search,
    Filter,
    ThumbsUp,
    MessageSquare,
    Menu,
    X,
    ChevronDown,
    User,
    PlusCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../shared/Navbar'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setAllPosts } from '@/redux/communityPostSlice'
import { Logout } from './auth/Logout'


const CommunityBrowse = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [sortOption, setSortOption] = useState("newest")
    const allPosts  = useSelector(store => store.communityPost.allPosts)
    const user = useSelector(store => store.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // Format date to a more readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 0) {
            return "Today"
        } else if (diffDays === 1) {
            return "Yesterday"
        } else if (diffDays < 7) {
            return `${diffDays} days ago`
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
            })
        }
    }


    useEffect(() => {
        const fetchAllPosts= async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_POST_API_ENDPOINT}`, {
                headers: { authorization: user?.token },
                withCredentials: true
            })
            if (response.data.success) {

            }

        } catch (error) {
            if (error.response.status === 401) {
                await Logout(dispatch, navigate, user); // handle logout
                return toast.error('Session expired. Please log in again.');
            }
        }}
    })


    // Sort posts based on selected option


    const [inputValue, setInputValue] = useState({
        title: "",
        description: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    useEffect(() => {
        const fetchPosts = async () => {
            try {

                const response = await axios.get(`${import.meta.env.VITE_POST_API_ENDPOINT}`, {
                    headers: { authorization: user?.token },
                    withCredentials: true
                })
                if (response.data.success) {
                    dispatch(setAllPosts(response?.data?.posts))

                }

            } catch (error) {
                console.log(error)
                if (error.response.status === 401) {
                    await Logout(dispatch, navigate, user); // handle logout
                    return toast.error('Session expired. Please log in again.');
                }
                toast.error(error?.response?.data?.message || 'Failed to fetch posts')
            }
        }
        fetchPosts()

    }, [])


    const handleCreatePost = async (e) => {
        e.preventDefault()
        const formData = {
            title: inputValue.title,
            description: inputValue.description
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_POST_API_ENDPOINT}`, formData, { headers: { authorization: user?.token }, withCredentials: true })
            if (response.data.success) {
                toast.success("Post created successfully")
                setInputValue({
                    title: "",
                    description: "",
                })

                navigate("/community")
                window.location.reload()

            }

        } catch (error) {
            if (error.response.status === 401) {
                await Logout(dispatch, navigate, user); // handle logout
                return toast.error('Session expired. Please log in again.');
            }
            console.log(error.response)
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 border-b bg-background">
                <Navbar />
            </header>

            <main className="flex-1 container py-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Community Posts</h1>
                        <p className="text-muted-foreground mt-1">Share and discuss legal questions with the community</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <Link to="/community">
                            <Button variant="outline" className="flex items-center gap-2 w-full">
                                <User className="h-4 w-4" />
                                My Activity
                            </Button>
                        </Link>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2 w-full md:w-auto">
                                    <PlusCircle className="h-4 w-4" />
                                    Create New Post
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Create New Post</DialogTitle>
                                    <DialogDescription>
                                        Fill out the form below to publish a new community post.
                                    </DialogDescription>
                                </DialogHeader>

                                <form className="space-y-4" onSubmit={handleCreatePost}>
                                    <div>
                                        <Label htmlFor="title">Title</Label>
                                        <Input id="title" name="title" placeholder="Enter your post title" value={inputValue.title} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" name="description" value={inputValue.description} placeholder="Write your post..." rows={5} onChange={handleChange} />
                                    </div>

                                    <DialogFooter>
                                        <Button type="submit" >Publish</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {allPosts.length > 0 ? (
                    <div className="space-y-6">
                        {allPosts.map((post) => (
                            <Link key={post._id} to={`/community/post/${post._id}`} className="block">
                                <div className="border rounded-lg p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                                        <h3 className="text-xl font-semibold">{post.title}</h3>
                                        <div className="flex items-center gap-2">

                                            <span className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</span>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Posted by {post.author.name}</span>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <ThumbsUp className="h-4 w-4" />
                                                <span>{post.likes.length}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>{post.comments.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border rounded-lg">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No community posts yet</h3>
                        <p className="text-muted-foreground mb-6">Be the first to start a discussion in the LegalWise community</p>
                        <Link to="/community/new">
                            <Button>Create a Post</Button>
                        </Link>
                    </div>
                )}
            </main>

            <footer className="border-t py-6 bg-slate-50 dark:bg-slate-900">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-primary" />
                            <span className="font-bold">LegalWise</span>
                        </div>

                        <p className="text-sm text-muted-foreground text-center md:text-right">
                            © {new Date().getFullYear()} LegalWise. All rights reserved.
                            <br className="md:hidden" />
                            <span className="hidden md:inline"> | </span>
                            LegalWise provides legal information, not legal advice.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default CommunityBrowse