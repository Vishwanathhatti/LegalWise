import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { Moon, Scale, Sun } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setDarkmode } from '@/redux/modeSlice'
import { setUser } from '@/redux/authSlice'
import { Logout } from '../pages/auth/Logout'

const Navbar = () => {
  const user = useSelector(store => store.auth.user)
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.mode.darkmode);
  const toggleTheme = () => {
    dispatch(setDarkmode(!darkMode))
  };

  return (
    <div className='max-w-7xl mx-auto p-3 '>
      <div className=" p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale size={35} color={"#6342eb"} />
          <h1 className='font-bold text-3xl dark:text-[#6342eb]'>  LegalWise</h1>
        </div>

        <div className='flex items-center gap-5'>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
          </Button>

          {
            user ? (<div className='flex items-center gap-2'>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src="https://a0.anyrgb.com/pngimg/1140/162/user-profile-login-avatar-heroes-user-blue-icons-circle-symbol-logo.png" />
                      
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { Logout(dispatch, navigate) }}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>)
              :
              (<div className='flex gap-5'><Link to="/login"><Button className="bg-[#6342eb] hover:bg-[#755cd7] dark:hover:bg-white text-white dark:hover:text-black">Login</Button></Link> <Link to="signup"><Button variant="outline">Get Started</Button></Link> </div>)
          }


        </div>

      </div>


    </div>
  )
}

export default Navbar