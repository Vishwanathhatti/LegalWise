import React, { useEffect, useState } from 'react'
import { Button } from '../../ui/button';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { useGetAllUserConversations } from '@/hooks/useGetAllUserConversations';

const Login = () => {
    const user = useSelector(store=>store.auth.user)
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
      if(user){
          navigate("/");
      }
  },[])

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const formData = {
          email: email,
          password: password,
        };

        const response = await axios.post('http://localhost:5000/api/user/login',formData)

        if(response.data.success == true){
          localStorage.setItem("token",response.data.token)
          await dispatch(setUser(response.data.user))
          toast.success(response.data.message)
          navigate('/')
        }

      } catch (error) {
        console.log(error)
        toast.error(error.response?.data.message)
        
      }

    };
  
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-accent to-background p-4">
        <div className="w-full max-w-md space-y-8 animate-float">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-gray-500">
              Please enter your details to sign in
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
  
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
  
            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline transition-all text-[#6342eb]">Forgot password?</Link>
            </div>
  
            <Button
              type="submit"
              className="w-full transition-all bg-[#6342eb] hover:bg-[#927bef] text-white "
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
  
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline transition-all text-[#6342eb]">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
}

export default Login