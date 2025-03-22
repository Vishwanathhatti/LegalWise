import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LayoutDashboard } from 'lucide-react'
import { useGetAllUserConversations } from '@/hooks/useGetAllUserConversations'
import Navbar from '../shared/Navbar'
import { useSelector } from 'react-redux'

const Home = () => {
  const navigate = useNavigate()
  const user = useSelector(store => store.auth.user)
  if(user){
        useGetAllUserConversations()
        // navigate('/dashboard')
      }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-accent to-background">
        <div className="max-w-3xl text-center space-y-8 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to LegalWise
          </h1>
          <p className="text-lg text-muted-foreground">
            Your trusted AI-powered legal assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#6342eb] hover:bg-[#927bef] text-white">
              <Link to="/chat">
                Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/dashboard"> Visit Dashboard <LayoutDashboard /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home