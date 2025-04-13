import { Contact, Eye, EyeOff, Mail, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const Signup = () => {
    const navigate = useNavigate()
    const user = useSelector(store=>store.auth.user)
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: ''
    })

    useEffect(()=>{
      
        if(user){
            navigate('/')
        }
    },[])

    const submitHandler = async (e) => {
        e.preventDefault()
        const formData = {
            name: input.name,
            email: input.email,
            phoneNumber: input.phoneNumber,
            password: input.password
        }

        try {
          const response = await axios.post(`${import.meta.env.VITE_USER_API_ENDPOINT}/register`, formData)
          if(response.data.success == true){
            toast.success(response.data.message)
            navigate('/login')
          }
        } catch (error) {
          toast.error(error.response?.data.message)
        }
        
    }

    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-accent to-background p-4">
        <div className="w-full max-w-md space-y-8 animate-float">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Create Account</h1>
            <p className="text-gray-500">
              Join LegalWise to get started
            </p>
          </div>
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={input.name}
                  onChange={(e) => setInput({ ...input, name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={input.email}
                  onChange={(e) => setInput({ ...input, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Contact className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="phoneNumber"
                  type="phoneNumber"
                  placeholder="9999999999"
                  value={input.phoneNumber}
                  onChange={(e) => setInput({ ...input, phoneNumber: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
  
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={input.password}
                  onChange={(e) => setInput({ ...input, password: e.target.value })}
                  className="pr-10"
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
  
            <Button type="submit" className="w-full bg-[#6342eb] hover:bg-[#927bef] text-white">
              Sign Up
            </Button>
  
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline transition-all text-[#6342eb]">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
}

export default Signup;