import { setSinglePost } from '@/redux/communityPostSlice';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Scale, ArrowLeft, ThumbsUp, MessageSquare,
  Share, Flag, MoreHorizontal, Send, Trash2, Edit
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Navbar from '../shared/Navbar';
import { Logout } from './auth/Logout';

const ViewPostPage = () => {
  const { id: postId } = useParams();
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_POST_API_ENDPOINT}/getpostbyid/${postId}`, {
        headers: { authorization: user?.token },
        withCredentials: true,
      });
      if (response.status === 401) return Logout(dispatch, navigate, user);
      if (response.data.success) dispatch(setSinglePost(response.data.post));
    } catch (error) {
      if (error?.response?.status === 401) Logout(dispatch, navigate, user);
      else toast.error(error?.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchPost();
  }, [postId]);

  const post = useSelector((store) => store.communityPost.singlePost);
  const sortedComments = post?.comments ? [...post.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
  const hasUserLiked = post?.likes?.includes(user._id);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    else if (diffDays === 1) return "Yesterday at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    else if (diffDays < 7) return `${diffDays} days ago`;
    else return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
  };

  // Handle Like/Unlike Post
  const handleLikeToggle = async () => {
    try {
      const url = hasUserLiked
        ? `${import.meta.env.VITE_POST_API_ENDPOINT}/unlike/${postId}`
        : `${import.meta.env.VITE_POST_API_ENDPOINT}/like/${postId}`;

      const res = await axios.put(url, {}, {
        headers: { authorization: user?.token },
        withCredentials: true
      });
      window.location.reload();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error updating like status");
    }
  };

  // Submit Comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`${import.meta.env.VITE_COMMENT_API_ENDPOINT}/add-comment/${postId}`, {
        text: newComment
      }, {
        headers: { authorization: user?.token },
        withCredentials: true
      });
      window.location.reload();
    } catch (err) {
      toast.error("Failed to post comment");
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_COMMENT_API_ENDPOINT}/remove-comment/${commentId}`, {
        headers: { authorization: user?.token },
        withCredentials: true
      });
      window.location.reload();
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  // Like/Unlike Comment
  const handleCommentLikeToggle = async (commentId, liked) => {
    try {
      const url = liked
        ? `${import.meta.env.VITE_COMMENT_API_ENDPOINT}/removelike-comment/${commentId}`
        : `${import.meta.env.VITE_COMMENT_API_ENDPOINT}/addlike-comment/${commentId}`;

      const res = await axios.put(url, { commentId }, {
        headers: { authorization: user?.token },
        withCredentials: true
      });
      window.location.reload();

    } catch (err) {
      toast.error("Failed to update comment like");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!post) return <div className="text-center py-20">Post not found.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <Navbar />
      </header>

      <main className="container flex-1 py-8 max-w-4xl mx-auto">
        <Link to="/community" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Community
        </Link>

        <div className="border rounded-lg p-6 mb-8">
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex gap-1">
                <Share className="h-4 w-4" /> Share
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm"><MoreHorizontal /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Flag className="h-4 w-4 mr-2" /> Report Post</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarFallback>{post.author?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post?.author?.name}</div>
              <div className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</div>
            </div>
          </div>

          <p className="mb-6 whitespace-pre-line">{post.description}</p>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleLikeToggle} className={hasUserLiked ? "bg-primary/10 text-primary" : ""}>
              <ThumbsUp className="h-4 w-4" /> {post.likes.length}
            </Button>
            <div className="text-muted-foreground text-sm flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> {post.comments.length} comments
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex gap-3 items-start">
              <Avatar>
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="mb-2 min-h-[100px]" />
                <div className="text-right">
                  <Button type="submit" disabled={!newComment.trim()}><Send className="h-4 w-4 mr-2" /> Post</Button>
                </div>
              </div>
            </div>
          </form>

          <div className="space-y-6">
            {sortedComments.map(comment => (
              <div key={comment._id} className="border rounded-lg p-4">
                <div className="flex justify-between mb-3">
                  <div>
                    <Avatar>
                      <AvatarFallback>{comment.author?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium ml-2">{comment.author.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">{formatDate(comment.createdAt)}</span>
                  </div>

                  {comment.author._id === user._id && (
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment._id)}><Trash2 className="h-4 w-4" /></Button>
                  )}
                </div>

                <p>{comment.text}</p>

                <div className="flex gap-2 items-center mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCommentLikeToggle(comment._id, comment.likes.includes(user._id))}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="ml-1 text-sm">{comment.likes.length}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewPostPage;
