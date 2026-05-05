"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft, 
    Save, 
    User, 
    MessageSquare, 
    Bell, 
    ShieldCheck, 
    Camera,
    Sparkles,
    CheckCircle2,
    RefreshCcw,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const EditProfile = () => {
    const { t } = useLanguage();
    const router = useRouter();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Auto-reply states
    const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
    const [autoReplyMessage, setAutoReplyMessage] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("currentUser");
        if (!user) {
            router.push("/auth");
            return;
        }
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);

        // Load auto-reply settings
        const allAutoReplies = JSON.parse(localStorage.getItem("userAutoReplies") || "{}");
        const userSettings = allAutoReplies[parsedUser.id];
        
        if (userSettings) {
            setAutoReplyEnabled(userSettings.enabled ?? true);
            setAutoReplyMessage(userSettings.message || "");
        } else {
            // Default message if none exists
            setAutoReplyMessage(`Hi, thanks for your interest! I'm currently away but I'll get back to you as soon as possible.`);
            setAutoReplyEnabled(false);
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;

        // 1. Update user info
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedUsers = users.map((u: any) => {
            if (u.id === currentUser.id) {
                return { ...u, name, phone };
            }
            return u;
        });
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        const updatedUser = { ...currentUser, name, phone };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);

        // 2. Update auto-reply settings
        const allAutoReplies = JSON.parse(localStorage.getItem("userAutoReplies") || "{}");
        allAutoReplies[currentUser.id] = {
            enabled: autoReplyEnabled,
            message: autoReplyMessage
        };
        localStorage.setItem("userAutoReplies", JSON.stringify(allAutoReplies));

        setTimeout(() => {
            toast({
                title: t.profile_updated,
                description: t.profile_updatedDesc,
            });
            setIsLoading(false);
        }, 800);
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-muted/20">
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-5xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/dashboard")}
                            className="mb-2 -ml-3 h-8 hover:bg-transparent text-muted-foreground hover:text-primary gap-1 group font-bold uppercase tracking-widest text-[10px]"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                            {t.postAd_backToHome}
                        </Button>
                        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                           {t.nav_editProfile}
                           <Sparkles className="h-7 w-7 text-yellow-500 fill-yellow-500" />
                        </h1>
                        <p className="text-muted-foreground font-medium">{t.profile_manageProfile}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                    {/* Left Side: Avatar & Bio */}
                    <div className="space-y-8">
                        <Card className="border-none shadow-2xl shadow-primary/5 overflow-hidden rounded-3xl">
                            <div className="h-32 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
                            <CardContent className="pt-0 relative px-6 pb-8 text-center">
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 ring-8 ring-white rounded-[2rem] overflow-hidden group shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                                   <div className="w-32 h-32 bg-muted flex items-center justify-center relative overflow-hidden">
                                        {currentUser.avatar ? (
                                            <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="h-14 w-14 text-muted-foreground" />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                            <Camera className="h-8 w-8 text-white scale-75 group-hover:scale-100 transition-transform" />
                                        </div>
                                   </div>
                                </div>
                                <div className="pt-20">
                                    <h3 className="font-black text-2xl tracking-tight mb-1">{currentUser.name}</h3>
                                    <p className="text-sm text-muted-foreground font-medium">{currentUser.email}</p>
                                    <div className="mt-6 flex flex-col items-center gap-3">
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
                                            <CheckCircle2 className="h-3 w-3 mr-1.5" />
                                            {t.profile_verifiedPro}
                                        </Badge>
                                        <div className="h-1 w-12 bg-muted rounded-full" />
                                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] w-full">
                                            Established {new Date(currentUser.createdAt || Date.now()).getFullYear()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-primary/5 border-primary/10 rounded-3xl border-none shadow-xl shadow-primary/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-primary">
                                    <ShieldCheck className="h-4 w-4" />
                                    {t.profile_security}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-[11px] font-bold text-muted-foreground/80 leading-relaxed uppercase tracking-wider">
                                    Your personal data is encrypted and secure. Managing your profile helps buyers trust your listings.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Personal Information */}
                        <Card className="border-none shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden">
                            <CardHeader className="border-b bg-white/50 backdrop-blur-md p-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/10">
                                        <User className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black tracking-tight">{t.profile_accountInfo}</CardTitle>
                                        <CardDescription className="text-sm font-medium">{t.profile_publicInfoDesc}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">{t.profile_fullName}</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={currentUser.name}
                                            required
                                            className="h-14 bg-muted/20 border-none rounded-2xl focus:ring-primary/20 focus:bg-background transition-all text-base font-bold shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="phone" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">{t.profile_phone}</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            defaultValue={currentUser.phone || ""}
                                            placeholder="0771234567"
                                            className="h-14 bg-muted/20 border-none rounded-2xl focus:ring-primary/20 focus:bg-background transition-all text-base font-bold shadow-inner"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">{t.profile_email}</Label>
                                    <div className="relative group">
                                        <Input
                                            id="email"
                                            value={currentUser.email}
                                            disabled
                                            className="h-14 bg-muted/10 border-none rounded-2xl text-muted-foreground/60 font-bold opacity-80"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full">
                                            <Bell className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Primary</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground/70 ml-2 italic flex items-center gap-1.5 uppercase tracking-wider">
                                        <AlertCircle className="w-3 h-3" />
                                        Contact support if you need to update your email.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Auto-Reply Settings */}
                        <Card className={cn(
                            "border-none shadow-2xl shadow-primary/5 transition-all duration-700 overflow-hidden rounded-3xl",
                            autoReplyEnabled ? "ring-2 ring-primary/20 bg-primary/[0.01]" : "bg-white"
                        )}>
                            <CardHeader className="border-b bg-white/30 backdrop-blur-md p-8 relative">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 border border-transparent shadow-lg",
                                            autoReplyEnabled ? "bg-primary text-white shadow-primary/20" : "bg-muted text-muted-foreground"
                                        )}>
                                            <MessageSquare className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                                                {t.profile_autoReply}
                                                {autoReplyEnabled && <CheckCircle2 className="h-4 w-4 text-green-500 animate-in zoom-in-0 duration-500" />}
                                            </CardTitle>
                                            <CardDescription className="text-sm font-medium">{t.profile_autoReplyDesc}</CardDescription>
                                        </div>
                                    </div>
                                    <Switch 
                                        checked={autoReplyEnabled}
                                        onCheckedChange={setAutoReplyEnabled}
                                        className="data-[state=checked]:bg-primary h-7 w-12"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className={cn(
                                    "space-y-4 transition-all duration-700 ease-in-out",
                                    autoReplyEnabled ? "opacity-100 translate-y-0" : "opacity-30 scale-[0.98] blur-[2px] pointer-events-none grayscale translate-y-4"
                                )}>
                                    <div className="space-y-3">
                                        <Label htmlFor="autoMessage" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">{t.profile_autoReplyMsg}</Label>
                                        <Textarea
                                            id="autoMessage"
                                            placeholder="Write your message here..."
                                            value={autoReplyMessage}
                                            onChange={(e) => setAutoReplyMessage(e.target.value)}
                                            rows={5}
                                            className="bg-muted/10 border-2 border-primary/5 focus-visible:border-primary/30 rounded-2xl p-5 text-base font-medium resize-none shadow-inner leading-relaxed"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10 transition-all group hover:bg-primary/10">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
                                            <Bell className="h-5 w-5" />
                                        </div>
                                        <p className="text-xs font-bold text-primary/80 uppercase tracking-wider leading-relaxed">
                                            Buyers will see this message immediately after sending their first inquiry.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button Section */}
                        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-6 mt-4 pb-12">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-center sm:text-left max-w-xs">
                                changes are secured and private to your TradeHub account
                            </p>
                            <Button 
                                type="submit" 
                                disabled={isLoading} 
                                className="h-16 px-12 rounded-[2rem] text-lg font-black shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-white uppercase tracking-tighter disabled:opacity-70 flex-shrink-0"
                            >
                                {isLoading ? (
                                    <RefreshCcw className="w-6 h-6 animate-spin mr-3" />
                                ) : (
                                    <Save className="w-6 h-6 mr-3" />
                                )}
                                {isLoading ? "Syncing..." : t.profile_saveChanges}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default EditProfile;
