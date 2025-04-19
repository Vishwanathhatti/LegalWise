import React, { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { EyeIcon, EyeOffIcon, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import Navbar from "@/components/shared/Navbar"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const params = useParams()
  const token = params.id

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const validations = [
    {
      id: "length",
      label: "At least 8 characters",
      valid: newPassword.length >= 8
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter",
      valid: /[A-Z]/.test(newPassword)
    },
    {
      id: "lowercase",
      label: "At least one lowercase letter",
      valid: /[a-z]/.test(newPassword)
    },
    {
      id: "number",
      label: "At least one number",
      valid: /[0-9]/.test(newPassword)
    },
    {
      id: "special",
      label: "At least one special character",
      valid: /[^A-Za-z0-9]/.test(newPassword)
    },
    {
      id: "match",
      label: "Passwords match",
      valid: newPassword === confirmPassword && confirmPassword !== ""
    }
  ]

  const isFormValid = validations.every((validation) => validation.valid)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isFormValid) {
      toast.error("Please fix the validation errors before submitting.")
      return
    }

    if (!token) {
      toast.error("Reset token is missing. Please request a new password reset link.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_USER_API_ENDPOINT}/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ newPassword })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Something went wrong.")
      }

      setSuccess(true)
      toast.success("Password reset successful! Redirecting to login...")

      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      toast.error(err.message || "Failed to reset password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="min-h-[70vh] justify-center items-center flex flex-col">
        <div className="w-full max-w-4xl mx-auto">
          {success ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-green-600">
                  Password Reset Successful
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <p className="mb-4">Your password has been successfully reset.</p>
                <p className="text-muted-foreground">
                  You will be redirected to the login page in a few seconds...
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => navigate("/login")}>
                  Go to Login
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Reset Your Password</CardTitle>
                <CardDescription>
                  Please enter a new password for your LegalWise account.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Password Requirements:</p>
                    <ul className="space-y-1 text-sm">
                      {validations.map((validation) => (
                        <li key={validation.id} className="flex items-center gap-2">
                          {validation.valid ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-300" />
                          )}
                          <span
                            className={
                              validation.valid ? "text-green-600" : "text-muted-foreground"
                            }
                          >
                            {validation.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={!isFormValid || isSubmitting}>
                    {isSubmitting ? "Resetting Password..." : "Reset Password"}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    <Link to="/login" className="hover:text-primary underline underline-offset-4">
                      Return to login
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
