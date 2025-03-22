
import { Camera } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Navbar from "../shared/Navbar";
import { useSelector } from "react-redux";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const [input, setInput] = useState({
    name: user.name,
    email: user.email,
    phoneNumber:user.phoneNumber,
    password: "",
    newPassword: "",
  })

  return (
    <div className="w-full  relative">
        <Navbar />

      <div className="container  max-w-2xl mx-auto p-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">


          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={input.name}
                onChange={(e) => setInput({ ...input, name: e.target.value })}
                defaultValue="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={input.email}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact</Label>
              <Input
                id="phone"
                type="number"
                placeholder="9999999999"
                value={input.phoneNumber}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={input.password}
                onChange={(e) => setInput({ ...input, password: e.target.value })}
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={input.newPassword}
                onChange={(e) => setInput({ ...input, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>

            <Button className="w-full bg-[#6342eb] hover:bg-[#927bef] text-white" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
