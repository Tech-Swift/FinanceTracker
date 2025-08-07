import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

export default function AuthModal() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const { open, closeModal, tab, setTab } = useAuthModal();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login({
        email: formData.email,
        password: formData.password,
      });

      if (success) {
        toast.success("Welcome back!");
        closeModal();
        navigate("/dashboard"); // ✅ Redirect to dashboard
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await signup(formData);
      if (success) {
        toast.success("Signup successful! Redirecting to login.");
        setTab("login");
      } else {
        toast.error("Signup failed. Please check your input.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Signup error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent className="max-w-md w-full">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <p className="text-sm text-center mt-2">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className="text-blue-600 underline"
                >
                  Signup
                </button>
              </p>
            </form>
          </TabsContent>

          {/* Signup Form */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div>
                <Label>Name</Label>
                <Input name="name" onChange={handleChange} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing up..." : "Signup"}
              </Button>
              <p className="text-sm text-center mt-2">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-blue-600 underline"
                >
                  Log In
                </button>
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
