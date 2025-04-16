import { Button } from "@/components/ui/button";
import { Menu, Moon, Send, Sun, PanelLeftClose, PanelLeftOpen, Users, Loader2, ArrowBigDown, ArrowDown } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "../ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef, useState } from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setDarkmode } from "@/redux/modeSlice";
import { Logout } from "./auth/Logout";
import useGetCurrentConversation from "@/hooks/useGetCurrentConversation";
import axios from "axios";
import { toast } from "sonner";
import { useGetAllUserConversations } from "@/hooks/useGetAllUserConversations";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
const ChatSidebar = () => {
    useGetAllUserConversations();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(store => store.auth.user);
    const conversations = useSelector(store => store.conversation.allUserConversation);

    const [title, setTitle] = useState("");

    const filteredConversations = conversations
        .map(convo => ({
            _id: convo._id,
            title: convo.title,
            createdAt: new Date(convo.createdAt).toLocaleString(),
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleCreateConversation = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                title: title
            }
            const token = user.token;
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
            console.log(error)
            if (error.response.status === 401) {
                await Logout(dispatch, navigate, user); // handle logout
                return toast.error('Session expired. Please log in again.');
            }
            toast.error(error.response?.data?.message);
        }
    };

    return (
        <Sidebar>
            <SidebarContent className="bg-accent p-4 w-[280px]">
                <div className="space-y-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                                + New Chat
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Conversation</DialogTitle>
                            </DialogHeader>
                            <Input
                                type="text"
                                placeholder="Enter conversation title"
                                value={title}
                                name="title"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <DialogFooter>
                                <Button onClick={handleCreateConversation}>Create</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <div className="space-y-2 ">
                        <Link to="/community" className="space-y-2 hover:bg-black">
                            <Button  variant="outline" className="w-full justify-start text-left font-semibold "><Users/>Community</Button>
                        </Link>
                        <div className="text-xs font-semibold text-muted-foreground">
                            Recent Chats
                        </div>
                        <div className="space-y-2 max-h-[70vh] overflow-y-auto hide-scrollbar">
                            {filteredConversations.map((convo) => (
                                <Link to={`/chat/${convo._id}`} key={convo._id}>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-left font-normal hover:bg-[#afafaf] dark:hover:bg-black"
                                    >
                                        {convo.title}
                                    </Button>
                                </Link>
                            ))}
                        </div>

                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    );
};



const ChatLayout = () => {
    const darkMode = useSelector(store => store.mode.darkmode);
    const user = useSelector(store => store.auth.user);
    const token = user?.token;
    const isMobile = useIsMobile();
    const [input, setInput] = useState({
        content: "",
    });
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const { id: conversationId } = useParams();

    const currentConversation = useGetCurrentConversation(conversationId);

    useEffect(() => {
        dispatch({ type: "conversation/resetMessages" });
    }, [conversationId, dispatch]);

    const chats = useSelector((store) => store.conversation.currentConversation?.messages || []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [chats]);

    const [localMessages, setLocalMessages] = useState(chats);

    useEffect(() => {
        setLocalMessages(chats);
    }, [chats]);


    function removeHtmlBackticks(input) {
        // Remove ```html and ``` from the string
        return input.replace(/```html\s*|```/g, '').trim();
      }
      

    const toggleTheme = () => {
        dispatch(setDarkmode(!darkMode));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true)
        const newMessage = { role: "user", content: input.content };
        setLocalMessages((prev) => [...prev, newMessage]); // Update local messages
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to ensure DOM updates before scrolling
        try {
            const formData = { content: input.content };
            const response = await axios.post(
                `${import.meta.env.VITE_CONVERSATION_API_ENDPOINT}/${conversationId}`,
                formData,
                {
                    headers: { authorization: token },
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                setLocalMessages((prev) => [...prev, response.data.aiMessage])
                setInput({content:''});
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);


            }
        } catch (error) {
            if (error.response.status === 401) {
                await Logout(dispatch, navigate, user); // handle logout
                return toast.error('Session expired. Please log in again.');
            }
            toast.error(error.response?.data?.message || error.message);
        }finally{
            setLoading(false)
        }
    };

    return (
        <SidebarProvider open={open} onOpenChange={setOpen}>
            <div className="min-h-screen flex w-full">
                <ChatSidebar />
                <div className="flex-1 flex flex-col">
                    <div className="border-b p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {isMobile ? (
                                <SidebarTrigger><Menu className="h-5 w-5" /></SidebarTrigger>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setOpen(!open)}
                                    className="rounded-full"
                                >
                                    {!open ? (
                                        <PanelLeftOpen className="h-5 w-5" />
                                    ) : (
                                        <PanelLeftClose className="h-5 w-5" />
                                    )}
                                </Button>
                            )}
                            <h1 className="font-bold dark:text-[#6342eb] text-xl">LegalWise</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="rounded-full"
                            >
                                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Avatar>
                                            <AvatarImage src="https://cdn-icons-png.flaticon.com/512/11772/11772904.png" />
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                        <Link to="/dashboard">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/profile">Profile Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => { Logout(dispatch, navigate, user) }}>
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="flex-1 max-h-[79vh] overflow-scroll p-4 md:pl-10 space-y-4 hide-scrollbar relevent">
                        {localMessages.map((message, index) => (
                            <div ref={messagesEndRef} key={index} className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                <p
                                    className={`max-w-[80%] p-4 rounded-lg ${message.role === "user"
                                        ? "bg-[#6342eb] text-white"
                                        : "bg-[#F1F5F9] text-black dark:bg-[#292929] dark:text-white"
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: removeHtmlBackticks(message.content) }}
                                ></p>
                            </div>
                        ))}

                    </div>
                    <div className="border-t p-4">
                        <form
                            onSubmit={submitHandler}
                            className="flex gap-2 md:pl-5"
                        >
                            <Input
                                value={input.content}
                                name="content"
                                onChange={(e) => setInput({ content: e.target.value })}
                                placeholder="Type your message..."
                                className="flex-1"
                                autoComplete="off"
                            />
                            {
                                loading? (<Button type="submit" size="icon" className="bg-[#6342eb] hover:bg-[#876bf7]">
                                    <Loader2 className="h-4 w-4 text-white animate-spin transition-all" />
                                </Button>):
                                (<Button type="disable" size="icon" className="bg-[#6342eb] hover:bg-[#876bf7]">
                                    <Send className="h-4 w-4 text-white" />
                                </Button>)
                            }

                        </form>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default ChatLayout;
