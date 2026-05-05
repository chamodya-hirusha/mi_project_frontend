"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, AlertCircle, CheckCircle2, Info, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import {
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  validatePassword,
  hashPassword,
  loginRateLimiter
} from "@/lib/security";
import { Building2, User as UserIcon, MessageSquareText } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const Auth = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileType, setProfileType] = useState<"Personal" | "business">("Personal");
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams?.get("mode");
    if (mode === "signup") {
      setActiveTab("signup");
      // Profile type is now defaulted to customer
    }
  }, [searchParams, profileType]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    
    // Business specific fields
    const businessName = formData.get("businessName") as string;
    const businessDescription = formData.get("businessDescription") as string;

    // Validate inputs
    if (!isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!isValidPhone(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Sri Lankan phone number (e.g., 0771234567)",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast({
        title: "Weak Password",
        description: passwordValidation.errors[0],
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      toast({
        title: "Error",
        description: "User with this email already exists",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Create new user with hashed password
    const newUser = {
      id: crypto.randomUUID(),
      email: sanitizeInput(email),
      password: hashPassword(password),
      name: profileType === "business" ? sanitizeInput(businessName) : sanitizeInput(name),
      phone: sanitizeInput(phone),
      role: profileType === "business" ? "business" : "user",
      businessName: profileType === "business" ? sanitizeInput(businessName) : undefined,
      businessDescription: profileType === "business" ? sanitizeInput(businessDescription) : undefined,
      profileType: profileType,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify({ 
      id: newUser.id, 
      email: newUser.email, 
      name: newUser.name, 
      phone: newUser.phone,
      role: newUser.role,
      profileType: newUser.profileType
    }));

    toast({
      title: "Success!",
      description: `${profileType === "business" ? "Business" : "Personal"} account created successfully`,
    });

    setIsLoading(false);
    router.push("/");
  };

  const handleProfileTypeSelect = (type: "Personal" | "business") => {
    setProfileType(type);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate email format
    if (!isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check rate limiting
    const rateLimitCheck = loginRateLimiter.check(email);
    if (!rateLimitCheck.allowed) {
      toast({
        title: "Too Many Attempts",
        description: "Too many login attempts. Please try again in 15 minutes.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const hashedPassword = hashPassword(password);
    const user = users.find((u: any) => u.email === email && u.password === hashedPassword);

    if (!user) {
      toast({
        title: "Invalid Credentials",
        description: `Invalid email or password. ${rateLimitCheck.remainingAttempts} attempts remaining.`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Reset rate limiter on successful login
    loginRateLimiter.reset(email);

    localStorage.setItem("currentUser", JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone || user.phoneNumber
    }));

    toast({
      title: "Welcome back!",
      description: "Signed in successfully",
    });

    setIsLoading(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 sm:mb-8 text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="max-w-md mx-auto mt-6 sm:mt-12">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to TradeHub.lk</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Sign in to your account or create a new one</p>
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-2xl font-bold text-slate-900">Sign In</CardTitle>
                  <CardDescription className="text-slate-500 mt-1">Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handleSignIn} className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        className="h-11 bg-slate-50/50 border-slate-200 rounded-lg focus:bg-white focus:border-primary transition-all font-medium focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-slate-300 hover:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          className="h-11 bg-slate-50/50 border-slate-200 rounded-lg focus:bg-white focus:border-primary transition-all font-medium pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-slate-300 hover:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-sm transition-all mt-8" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Demo User Credentials */}
              <Card className="mt-4 sm:mt-6 border-slate-200 bg-white shadow-lg">
                <CardHeader className="pb-3 border-b border-slate-100 p-4 sm:p-6">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <CardTitle className="text-base sm:text-lg text-slate-900">Demo Login Credentials</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                  <div className="bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-200">
                    <div className="text-xs font-semibold text-primary mb-2 sm:mb-3 uppercase tracking-wide">Demo User</div>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-slate-700 text-xs sm:text-sm font-medium">Email:</span>
                        <code className="text-slate-900 bg-white border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-mono font-semibold break-all">
                          demo@user.com
                        </code>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-slate-700 text-xs sm:text-sm font-medium">Password:</span>
                        <code className="text-slate-900 bg-white border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-mono font-semibold break-all">
                          password123
                        </code>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 text-center font-medium mt-3 sm:mt-4">
                    Use these credentials for demo purposes only
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="p-4 sm:p-5 border-b bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">
                        Sign Up
                      </CardTitle>
                      <CardDescription className="text-slate-500 mt-1">
                        Enter your details to create your account
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="mt-2 bg-muted/50 p-1 rounded-xl">
                    <RadioGroup
                      value={profileType}
                      onValueChange={(v) => setProfileType(v as "Personal" | "business")}
                      className="grid grid-cols-2 gap-1"
                    >
                      <Label
                        htmlFor="signup-customer"
                        className={cn(
                          "flex items-center justify-center gap-2 px-3 h-9 rounded-lg transition-all cursor-pointer font-medium text-xs",
                          profileType === "Personal"
                            ? "bg-white text-primary shadow-sm"
                            : "text-muted-foreground hover:bg-white/50"
                        )}
                      >
                        <RadioGroupItem value="Personal" id="signup-customer" className="sr-only" />
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>Personal</span>
                      </Label>

                      <Label
                        htmlFor="signup-business"
                        className={cn(
                          "flex items-center justify-center gap-2 px-3 h-9 rounded-lg transition-all cursor-pointer font-medium text-xs",
                          profileType === "business"
                            ? "bg-white text-primary shadow-sm"
                            : "text-muted-foreground hover:bg-white/50"
                        )}
                      >
                        <RadioGroupItem value="business" id="signup-business" className="sr-only" />
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Business</span>
                      </Label>
                    </RadioGroup>
                    

                  </div>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handleSignUp} className="space-y-3">
                    {profileType === "business" ? (
                      <>
                        <div className="space-y-1.5">
                          <Label htmlFor="signup-business-name" className="text-sm font-medium text-slate-700">Business Name</Label>
                          <Input
                            id="signup-business-name"
                            name="businessName"
                            type="text"
                            placeholder="TradeHub Auto Dealers"
                            required
                            className="h-11 bg-slate-50/50 border-slate-200 rounded-lg focus:bg-white focus:border-primary transition-all font-medium focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-slate-300 hover:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="signup-business-desc" className="text-sm font-medium text-slate-700">Business Description</Label>
                          <Input
                            id="signup-business-desc"
                            name="businessDescription"
                            type="text"
                            placeholder="Premium vehicle importer in Colombo"
                            required
                            className="h-11 bg-slate-50/50 border-slate-200 rounded-lg focus:bg-white focus:border-primary transition-all font-medium focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-slate-300 hover:outline-none"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1.5">
                        <Label htmlFor="signup-name" className="text-sm font-medium text-slate-700">Full Name</Label>
                        <Input
                          id="signup-name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          required
                          className="h-11 bg-slate-50/50 border-slate-200 rounded-lg focus:bg-white focus:border-primary transition-all font-medium focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-slate-300 hover:outline-none"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-slate-700">Email</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        className="h-11 bg-slate-50/50 border-slate-200 rounded-lg focus:bg-white focus:border-primary transition-all font-medium focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-slate-300 hover:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-phone" className="text-sm font-medium text-slate-700">Phone Number</Label>
                      <Input
                        id="signup-phone"
                        name="phone"
                        type="tel"
                        placeholder="0771234567"
                        required
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit phone number"
                        className="h-11 bg-slate-50/50 border-slate-200 rounded-lg focus:bg-white focus:border-primary transition-all font-medium focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-slate-300 hover:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-slate-700">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          minLength={8}
                          className="h-11 bg-slate-50/50 border-slate-200 rounded-lg focus:bg-white focus:border-primary transition-all font-medium pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-slate-300 hover:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-slate-700">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-confirm-password"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          minLength={8}
                          className="h-11 bg-slate-50/50 border-slate-200 rounded-lg focus:bg-white focus:border-primary transition-all font-medium pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-slate-300 hover:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-sm transition-all mt-8" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>

  );
};

export default Auth;
