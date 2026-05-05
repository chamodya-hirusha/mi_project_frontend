"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Lock, Info } from "lucide-react";
import { hashPassword, loginRateLimiter } from "@/lib/security";

const AdminLogin = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

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

        // Check if user exists and has admin access
        if (!user) {
            toast({
                title: "Invalid Credentials",
                description: "Invalid admin credentials.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        // Check if user has admin privileges
        if (!user.isAdmin &&
            user.role !== "super-admin" &&
            user.role !== "admin" &&
            user.role !== "branch-manager" &&
            user.role !== "ad-manager") {
            toast({
                title: "Access Denied",
                description: "This portal is restricted to administrative personnel only.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        // Check if user account is active (super-admin and admin accounts cannot be suspended)
        const isSuperAdmin = user.role === "super-admin" || user.email === "admin@tradehub.lk";
        if (!isSuperAdmin && user.status !== "active") {
            toast({
                title: "Account Suspended",
                description: "Your account has been suspended. Please contact the administrator.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        // Old check - remove this since we're checking isAdmin/role above
        if (false) {
            toast({
                title: "Invalid Credentials",
                description: "Invalid admin credentials.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        // Reset rate limiter
        loginRateLimiter.reset(email);

        // Set current user with proper role
        localStorage.setItem("currentUser", JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || (user.isAdmin ? "admin" : "user"),
            branchId: user.branchId
        }));

        const roleDisplay = user.role === "super-admin" ? "Super Admin" :
            user.role === "branch-manager" ? "Branch Manager" :
                user.role === "ad-manager" ? "Ads Manager" :
                    "Administrator";

        toast({
            title: `Welcome ${roleDisplay}`,
            description: user.role === "branch-manager"
                ? `Logged in as ${user.name} - Branch Manager`
                : "Secure session established.",
        });

        setIsLoading(false);
        router.push("/admin");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h1>
                    <p className="text-slate-600">Restricted Access Area</p>
                </div>

                <Card className="border-slate-200 bg-white shadow-xl">
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle className="text-xl text-slate-900">Administrator Login</CardTitle>
                        <CardDescription className="text-slate-600">
                            Please enter your secure credentials
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-medium">Admin Email</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@tradehub.lk"
                                        className="bg-white border-slate-300 text-slate-900 pl-10 focus:border-primary focus:ring-primary"
                                        required
                                        defaultValue="admin@tradehub.lk"
                                    />
                                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-white border-slate-300 text-slate-900 pl-10 focus:border-primary focus:ring-primary"
                                        required
                                    />
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? "Authenticating..." : "Access Dashboard"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Demo Login Credentials */}
                <Card className="border-slate-200 bg-white shadow-lg mt-6">
                    <CardHeader className="pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg text-slate-900">Demo Login Credentials</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        {/* Super Admin */}
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="text-xs font-semibold text-primary mb-3 uppercase tracking-wide">Super Admin</div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-700 text-sm font-medium">Email:</span>
                                    <code className="text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded text-sm font-mono font-semibold">
                                        admin@tradehub.lk
                                    </code>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-700 text-sm font-medium">Password:</span>
                                    <code className="text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded text-sm font-mono font-semibold">
                                        admin123
                                    </code>
                                </div>
                            </div>
                        </div>

                        {/* Ads Manager */}
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="text-xs font-semibold text-primary mb-3 uppercase tracking-wide">Ads Manager</div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-700 text-sm font-medium">Email:</span>
                                    <code className="text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded text-sm font-mono font-semibold">
                                        ads@tradehub.lk
                                    </code>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-700 text-sm font-medium">Password:</span>
                                    <code className="text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded text-sm font-mono font-semibold">
                                        ads123
                                    </code>
                                </div>
                            </div>
                        </div>

                        {/* Branch Managers */}
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="text-xs font-semibold text-primary mb-3 uppercase tracking-wide">Branch Managers</div>
                            <div className="space-y-2 text-xs">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-slate-600 font-medium">Colombo:</span>
                                        <code className="block text-slate-900 bg-white border border-slate-200 px-2 py-1.5 rounded mt-1 font-mono text-xs">
                                            saman.perera@tradehub.lk
                                        </code>
                                    </div>
                                    <div>
                                        <span className="text-slate-600 font-medium">Gampaha:</span>
                                        <code className="block text-slate-900 bg-white border border-slate-200 px-2 py-1.5 rounded mt-1 font-mono text-xs">
                                            kamal.gunaratne@tradehub.lk
                                        </code>
                                    </div>
                                    <div>
                                        <span className="text-slate-600 font-medium">Kandy:</span>
                                        <code className="block text-slate-900 bg-white border border-slate-200 px-2 py-1.5 rounded mt-1 font-mono text-xs">
                                            nimal.bandara@tradehub.lk
                                        </code>
                                    </div>
                                    <div>
                                        <span className="text-slate-600 font-medium">Galle:</span>
                                        <code className="block text-slate-900 bg-white border border-slate-200 px-2 py-1.5 rounded mt-1 font-mono text-xs">
                                            sunil.silva@tradehub.lk
                                        </code>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-200">
                                    <span className="text-slate-600 font-medium">All Branch Managers Password:</span>
                                    <code className="block text-slate-900 bg-white border border-slate-200 px-2 py-1.5 rounded mt-1 font-mono font-semibold text-xs">
                                        branch123
                                    </code>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 text-center font-medium pt-2">
                            Use these credentials for demo purposes only
                        </p>
                    </CardContent>
                </Card>

                <p className="text-center text-slate-500 text-xs mt-8">
                    Unauthorized access attempts are monitored and logged.
                    <br />
                    IP Address: {typeof window !== 'undefined' ? window.location.hostname : '...'}
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
