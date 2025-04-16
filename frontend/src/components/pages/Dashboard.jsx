import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from "@/components/ui/button"
import {
    Scale,
    MessageSquare,
    FileText,
    Book,
    Settings,
    HelpCircle,
    PlusCircle,
    ChevronRight,
    Bell,
    Menu,
    X,
    LogOut,
    Sun,
    Moon,
    Clock,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useGetAllUserConversations } from '@/hooks/useGetAllUserConversations'
import { Logout } from './auth/Logout'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { toast } from 'sonner'
import { setDarkmode } from '@/redux/modeSlice'
import { useGetAllUserPosts } from '@/hooks/useGetAllUserPosts'

const Dashboard = () => {
    useGetAllUserConversations();
    useGetAllUserPosts();
    const user = useSelector(store => store.auth.user)
    const userData = useSelector(store => store.auth.user)
    const allConversations = useSelector(store => store.conversation.allUserConversation);
    const allUserPosts = useSelector(store=> store.communityPost.allUserPosts)
    // console.log(allUserPosts)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const darkMode = useSelector((state) => state.mode.darkmode);
    const toggleTheme = () => {
        dispatch(setDarkmode(!darkMode))
    };
    const [title, setTitle] = useState("");

    const handleCreateConversation = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                title: title
            }
            const token = userData.token;
            const response = await axios.post(
                `${import.meta.env.VITE_CONVERSATION_API_ENDPOINT}/create`, formData,
                {
                    headers: { authorization: token },
                    withCredentials: true,
                }
            )
            if (response.data.success === true) {
                toast.success(response.data.message);
                navigate(`/chat/${response.data.conversation._id}`);
                window.location.reload()
            }

        } catch (error) {
            
            if (error.response.status === 401) {
                await Logout(dispatch, navigate, user); // handle logout
                return toast.error('Session expired. Please log in again.');
            }
            toast.error(error.response?.data?.message);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Mobile sidebar */}
            <div
                className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity lg:hidden ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/" className="flex items-center gap-2">
                            <Scale className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">LegalWise</span>
                        </Link>
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <nav className="space-y-2">
                        <Link to="/dashboard" className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                            Dashboard
                        </Link>
                        <Link
                            to="/chat"
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <MessageSquare className="h-5 w-5" />
                            Conversations
                        </Link>
                        <Link
                            to="/community/browse"
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Book className="h-5 w-5" />
                            Community
                        </Link>
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Settings className="h-5 w-5" />
                            Profile
                        </Link>
                        <Link
                            to="/help"
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <HelpCircle className="h-5 w-5" />
                            Help & Support
                        </Link>

                        <Link
                            onClick={() => Logout(dispatch, navigate, user)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <LogOut className="h-5 w-5" />
                            Logout
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">Welcome back, {userData.name}</h1>
                                <p className="text-muted-foreground">Here's an overview of your LegalWise account</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap md:justify-between justify-end items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="rounded-full"
                            >
                                {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
                            </Button>
                            <Button className=" sm:inline-flex">
                                Upgrade to {userData.plan === "Pro" ? "Enterprise" : "Pro"}
                            </Button>
                        </div>
                    </header>

                    {/* Quick stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{allConversations.length}</div>
                                {/* <p className="text-xs text-muted-foreground">+2 from last week</p> */}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Community Posts</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{allUserPosts.length}</div>
                                {/* <p className="text-xs text-muted-foreground">+1 from last week</p> */}
                            </CardContent>
                        </Card>
                        <Card className="sm:col-span-2 lg:col-span-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Last Login</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{new Date(userData.lastLogin).toLocaleDateString()}</div>
                                <p className="text-xs text-muted-foreground">at {new Date(userData.lastLogin).toLocaleTimeString()}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent conversations */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Recent Conversations</CardTitle>
                            <CardDescription>Quick access to your latest legal inquiries</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {allConversations.length > 0 ? (
                                    allConversations
                                        .slice(-3) // Get last 3 elements
                                        .reverse() // Reverse the order
                                        .map((conv) => (
                                            <div key={conv._id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <MessageSquare className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="font-medium">{conv.title}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(conv.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link to={`/chat/${conv._id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        View <ChevronRight className="h-4 w-4 ml-1" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))
                                ) : (
                                    <p className="text-center text-gray-500">No post's found</p>
                                )}
                            </div>
                            <div className="mt-4">
                                <Link to="/chat">
                                    <Button  className="w-full">
                                        View All Conversations
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Start a new conversation or review a document</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* New Conversation with ShadCN Dialog */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full">
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        New Conversation
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Start a New Conversation</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter conversation title"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleCreateConversation} disabled={!title.trim()}>
                                            Create
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Post on Community Button */}
                            <Link>
                                <Button variant="outline" className="w-full">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Post on Community
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default Dashboard