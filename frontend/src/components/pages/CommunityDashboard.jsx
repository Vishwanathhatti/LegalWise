import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Scale, Menu, X, PlusCircle, ThumbsUp, MessageSquare, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Navbar from '../shared/Navbar'
import { useGetAllUserComments } from '@/hooks/useGetAllUserComments'
import { useGetAllUserPosts } from '@/hooks/useGetAllUserPosts'
import { useDispatch, useSelector } from 'react-redux'
import { useGetAllLikedPosts } from '@/hooks/useGetAllLikedPosts'
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'
import { toast } from 'sonner'


const CommunityDashboard = () => {
    useGetAllUserPosts()
    useGetAllUserComments()
    useGetAllLikedPosts()

    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const allUserPosts = useSelector((state) => state.communityPost.allUserPosts)
    const allUserComments = useSelector((state) => state.communityComment.allUserComments)
    const allUserLikedPosts = useSelector((state) => state.communityPost.allLikedPosts)
    // console.log(allUserLikedPosts)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const [inputValue, setInputValue] = useState({
        title: "",
        description: "",
    })


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

    const handleDeletePost = (postId) => {
        // In a real app, you would call your API to delete the post
        console.log("Deleting post:", postId)
        // Then update the UI or show a success message
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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
            console.log(error.response)
                            if (error.response.status === 401) {
                                await Logout(dispatch, navigate, user); // handle logout
                                return toast.error('Session expired. Please log in again.');
                            }
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }


    return (
        <div className="flex min-h-screen flex-col ">
            <header className="sticky top-0 z-40 border-b bg-background">
                <Navbar />
            </header>

            <main className="flex-1 container py-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Community Activity</h1>
                        <p className="text-muted-foreground mt-1">Manage your posts and see your community interactions</p>
                    </div>

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

                <Tabs defaultValue="my-posts" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="my-posts" className="text-sm">
                            My Posts ({allUserPosts.length})
                        </TabsTrigger>
                        <TabsTrigger value="liked-posts" className="text-sm">
                            Liked Posts ({allUserLikedPosts.length})
                        </TabsTrigger>
                        <TabsTrigger value="commented-posts" className="text-sm">
                            Commented Posts ({allUserComments.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="my-posts" className="space-y-6">
                        {allUserPosts.length > 0 ? (
                            allUserPosts.map((post) => (
                                <Card key={post._id} className="overflow-hidden">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl">
                                                    <Link to={`/community/post/${post._id}`} className="hover:text-primary transition-colors">
                                                        {post.title}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription className="pt-1">{formatDate(post.createdAt)}</CardDescription>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <span className="sr-only">Open menu</span>
                                                        <svg
                                                            width="15"
                                                            height="15"
                                                            viewBox="0 0 15 15"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                        >
                                                            <path
                                                                d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                                                fill="currentColor"
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.push(`/community/post/${post._id}/edit`)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeletePost(post._id)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="line-clamp-2 text-muted-foreground">{post.description}</p>
                                    </CardContent>
                                    <CardFooter className="border-t pt-3 flex justify-between">
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
                                        <Link to={`/community/post/${post._id}`}>
                                            <Button variant="ghost" size="sm">
                                                View Post
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 border rounded-lg">
                                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                                <p className="text-muted-foreground mb-6">You haven't created any posts in the community</p>
                                <Link to="/community/new">
                                    <Button>Create Your First Post</Button>
                                </Link>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="liked-posts" className="space-y-6">
                        {allUserLikedPosts.length > 0 ? (
                            allUserLikedPosts.map((post) => (
                                <Card key={post._id} className="overflow-hidden">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl">
                                                    <Link
                                                        to={`/community/post/${post._id}`}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription className="pt-1 flex items-center gap-2">
                                                    <span>By {post.author?.name || "Unknown"}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(post.createdAt)}</span>
                                                </CardDescription>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1 bg-primary/10 text-primary"
                                            >
                                                <ThumbsUp className="h-4 w-4" />
                                                <span>Liked</span>
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="line-clamp-2 text-muted-foreground">{post.description}</p>
                                    </CardContent>
                                    <CardFooter className="border-t pt-3 flex justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <ThumbsUp className="h-4 w-4" />
                                                <span>{post.likes?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>{post.comments?.length || 0}</span>
                                            </div>
                                        </div>
                                        <Link to={`/community/post/${post._id}`}>
                                            <Button variant="ghost" size="sm">
                                                View Post
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 border rounded-lg">
                                <ThumbsUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No liked posts</h3>
                                <p className="text-muted-foreground mb-6">
                                    You haven't liked any posts in the community
                                </p>
                                <Link to="/community">
                                    <Button>Browse Community</Button>
                                </Link>
                            </div>
                        )}
                    </TabsContent>


                    <TabsContent value="commented-posts" className="space-y-6">
                        {allUserComments.length > 0 ? (
                            allUserComments.map((comment) => (
                                <Card key={comment._id} className="overflow-hidden">
                                    <CardHeader className="pb-3">
                                        <div>
                                            <CardTitle className="text-xl">
                                                <Link
                                                    to={`/community/post/${comment.post._id}`}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {comment.post.title}
                                                </Link>
                                            </CardTitle>
                                            <CardDescription className="pt-1 flex items-center gap-2">
                                                <span>By {comment.post.author}</span>
                                                <span></span>
                                                <span>{formatDate(comment.createdAt)}</span>
                                            </CardDescription>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <p className="line-clamp-2 text-muted-foreground">
                                            {comment.post.description}
                                        </p>

                                        <div className="bg-muted p-3 rounded-lg border-l-4 border-primary">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium">Your comment:</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{comment.text}</p>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="border-t pt-3 flex justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <ThumbsUp className="h-4 w-4" />
                                                <span>{comment.post?.likes?.length}</span>
                                            </div>
                                        </div>
                                        <Link to={`/community/${comment.post._id}`}>
                                            <Button variant="ghost" size="sm">
                                                View Post
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 border rounded-lg">
                                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No commented posts</h3>
                                <p className="text-muted-foreground mb-6">
                                    You haven't commented on any posts in the community
                                </p>
                                <Link to="/community">
                                    <Button>Browse Community</Button>
                                </Link>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>

            <footer className="border-t py-6 bg-slate-50 dark:bg-slate-900 mt-8 ">
                <div className="container max-w-7xl mx-auto ">
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



export default CommunityDashboard