import React, { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import platform from 'platform';

// ShadCN Dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Login = () => {
  const user = useSelector((store) => store.auth.user);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const [device, setDevice] = useState({
    deviceId: '',
    deviceInfo: '',
  });

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    const storedId = localStorage.getItem('deviceId') || crypto.randomUUID();
    if (!localStorage.getItem('deviceId')) {
      localStorage.setItem('deviceId', storedId);
    }

    const deviceInfo = `${platform.name} on ${platform.os?.family} (${platform.description})`;

    setDevice({
      deviceId: storedId,
      deviceInfo,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = {
        email,
        password,
        deviceId: device.deviceId,
        deviceInfo: device.deviceInfo,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_ENDPOINT}/login`,
        formData
      );

      if (response.data.success === true) {
        localStorage.setItem('token', response.data.token);
        await dispatch(setUser(response.data.user));
        toast.success(response.data.message);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.error('Email is required');
      return;
    }

    try {
      setForgotLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_USER_API_ENDPOINT}/forgot-password`,
        { email: forgotEmail }
      );

      toast.success(res.data.message);
      setDialogOpen(false);
      setForgotEmail('');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-accent to-background p-4">
      <div className="w-full max-w-md space-y-8 animate-float">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-gray-500">Please enter your details to sign in</p>
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
                type={showPassword ? 'text' : 'password'}
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
            {/* DialogTrigger wraps the link */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="text-sm text-[#6342eb] hover:underline transition-all"
                >
                  Forgot password?
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Enter your email to receive a password reset link.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  <Button
                    className="w-full bg-[#6342eb] hover:bg-[#927bef] text-white"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Button
            type="submit"
            className="w-full transition-all bg-[#6342eb] hover:bg-[#927bef] text-white"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary hover:underline transition-all text-[#6342eb]"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
