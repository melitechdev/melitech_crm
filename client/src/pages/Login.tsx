import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Implement actual authentication API call
      // For now, simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication - check credentials
      if (formData.username && formData.password) {
        // Store user session (in real app, this would come from API)
        const mockUser = {
          id: "1",
          username: formData.username,
          role: formData.username === "admin" ? "admin" : 
                formData.username === "hr" ? "hr" :
                formData.username === "accountant" ? "accountant" :
                formData.username === "staff" ? "staff" :
                formData.username === "client" ? "client" : "user",
        };
        
        localStorage.setItem("user", JSON.stringify(mockUser));
        toast.success("Login successful!");
        
        // Redirect based on role
        if (mockUser.role === "client") {
          setLocation("/client-portal");
        } else {
          setLocation("/dashboard");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            {APP_LOGO ? (
              <img src={APP_LOGO} alt={APP_TITLE} className="h-16 w-auto" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary-foreground" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">{APP_TITLE}</CardTitle>
          <CardDescription>
            Sign in to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => toast.info("Please contact your administrator to reset your password")}
              >
                Forgot password?
              </button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setLocation("/signup")}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Demo credentials hint */}
      <div className="fixed bottom-4 right-4 bg-card p-4 rounded-lg shadow-lg border max-w-sm">
        <p className="text-sm font-semibold mb-2">Demo Credentials:</p>
        <ul className="text-xs space-y-1 text-muted-foreground">
          <li>• Admin: <code>admin</code> / any password</li>
          <li>• HR: <code>hr</code> / any password</li>
          <li>• Accountant: <code>accountant</code> / any password</li>
          <li>• Staff: <code>staff</code> / any password</li>
          <li>• Client: <code>client</code> / any password</li>
        </ul>
      </div>
    </div>
  );
}

