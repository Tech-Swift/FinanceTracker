import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { useState } from "react";

export default function AuthModal() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // ✅ use global modal context (including tab state)
  const { open, closeModal, tab, setTab } = useAuthModal();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login({ email: formData.email, password: formData.password });
    setLoading(false);
    if (success) {
      closeModal(); // ✅ close on success
      navigate("/");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await signup(formData);
    setLoading(false);
    if (success) {
      setTab("login"); // ✅ switch to login after signup success
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

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" onChange={handleChange} required />
              </div>
              <div>
                <Label>Password</Label>
                <Input name="password" type="password" onChange={handleChange} required />
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

          {/* Signup Tab */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div>
                <Label>Name</Label>
                <Input name="name" onChange={handleChange} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" onChange={handleChange} required />
              </div>
              <div>
                <Label>Password</Label>
                <Input name="password" type="password" onChange={handleChange} required />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input name="confirmPassword" type="password" onChange={handleChange} required />
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
