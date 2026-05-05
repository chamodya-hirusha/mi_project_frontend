"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileMenu from "@/components/admin/AdminMobileMenu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
    Calculator, 
    Percent, 
    Calendar, 
    Coins, 
    Save, 
    RefreshCcw,
    AlertCircle,
    Building2,
    Mail,
    Phone,
    ShieldCheck,
    ArrowRight,
    TrendingUp
} from "lucide-react";
import { LeaseSettings } from "@/types";
import { defaultLeaseSettings } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const FinanceSettings = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [settings, setSettings] = useState<LeaseSettings>(defaultLeaseSettings);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Auth check
        const user = localStorage.getItem("currentUser");
        if (!user) {
            router.push("/auth");
            return;
        }

        const parsedUser = JSON.parse(user);
        const hasAccess = parsedUser.role === "super-admin" || parsedUser.email === "admin@tradehub.lk";

        if (!hasAccess) {
            toast({
                title: "Access Denied",
                description: "Only Super Admins can manage financial settings.",
                variant: "destructive",
            });
            router.push("/admin");
            return;
        }

        setCurrentUser(parsedUser);

        // Load settings
        const stored = localStorage.getItem("leaseSettings");
        if (stored) {
            setSettings(JSON.parse(stored));
        }
    }, [router, toast]);

    const handleSave = () => {
        setIsSaving(true);
        
        // Validation
        if (settings.minInterestRate > settings.maxInterestRate) {
            toast({
                title: "Invalid Range",
                description: "Min interest rate cannot be greater than max interest rate",
                variant: "destructive",
            });
            setIsSaving(false);
            return;
        }

        if (settings.defaultInterestRate < settings.minInterestRate || settings.defaultInterestRate > settings.maxInterestRate) {
            toast({
                title: "Invalid Default Value",
                description: "Default interest rate must be within the min and max range",
                variant: "destructive",
            });
            setIsSaving(false);
            return;
        }

        setTimeout(() => {
            localStorage.setItem("leaseSettings", JSON.stringify(settings));
            toast({
                title: "Settings Saved",
                description: "Financial settings have been updated successfully.",
            });
            setIsSaving(false);
        }, 800);
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        toast({
            title: "Logged out",
            description: "You have been successfully logged out",
        });
        router.push("/auth");
    };

    const resetToDefaults = () => {
        setSettings(defaultLeaseSettings);
        toast({
            title: "Reset to Defaults",
            description: "Settings have been reset to factory defaults.",
        });
    };

    if (!currentUser) return null;

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* Sidebar - Desktop */}
            <div className="hidden md:block w-72 flex-shrink-0 border-r bg-white">
                <AdminSidebar onLogout={handleLogout} />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-primary">TradeHub Admin</h2>
                    <AdminMobileMenu onLogout={handleLogout} />
                </div>

                <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Finance Management</h1>
                            <p className="text-slate-500 mt-1">Manage global interest rates and financial parameters.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={resetToDefaults} className="gap-2 border-slate-200 bg-white hover:bg-slate-50">
                                <RefreshCcw className="w-4 h-4" />
                                Reset
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-primary hover:bg-primary/90 shadow-md">
                                {isSaving ? (
                                    <RefreshCcw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Save Settings
                            </Button>
                        </div>
                    </div>

                    {/* Summary Cards Row - Matches Screenshot Style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-none shadow-sm border-l-4 border-blue-500 rounded-xl bg-white overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Default Rate</p>
                                        <h3 className="text-3xl font-black text-slate-900">{settings.defaultInterestRate}%</h3>
                                        <p className="text-[10px] text-slate-400 font-medium">Standard for all ads</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
                                        <Percent className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm border-l-4 border-indigo-500 rounded-xl bg-white overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Min Down Payment</p>
                                        <h3 className="text-3xl font-black text-slate-900">{settings.minDownPaymentPercentage}%</h3>
                                        <p className="text-[10px] text-slate-400 font-medium">Of vehicle valuation</p>
                                    </div>
                                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500">
                                        <Coins className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm border-l-4 border-green-500 rounded-xl bg-white overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Max Term</p>
                                        <h3 className="text-3xl font-black text-slate-900">{settings.maxLoanDuration}m</h3>
                                        <p className="text-[10px] text-slate-400 font-medium">Longest tenure allowed</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-xl text-green-500">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm border-l-4 border-purple-500 rounded-xl bg-white overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Processing Fee</p>
                                        <h3 className="text-2xl font-black text-slate-900">LKR {settings.processingFee.toLocaleString()}</h3>
                                        <p className="text-[10px] text-slate-400 font-medium">Fixed per application</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-xl text-purple-500">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Rate Configuration List - One line design */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 px-1">
                                <Percent className="w-5 h-5 text-slate-400" />
                                <h2 className="text-xl font-bold text-slate-900">Rate Configuration</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">Default Annual Interest Rate</span>
                                        <span className="text-xs text-slate-400">Affects all live calculators</span>
                                    </div>
                                    <div className="w-32 flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                        <Input 
                                            type="number"
                                            className="h-8 border-none bg-transparent font-black text-right p-0 focus-visible:ring-0"
                                            value={settings.defaultInterestRate}
                                            onChange={(e) => setSettings({ ...settings, defaultInterestRate: parseFloat(e.target.value) || 0 })}
                                        />
                                        <span className="font-bold text-slate-400">%</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">Minimum Allowed Rate</span>
                                        <span className="text-xs text-slate-400">Lower bound for custom plans</span>
                                    </div>
                                    <div className="w-32 flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                        <Input 
                                            type="number"
                                            className="h-8 border-none bg-transparent font-black text-right p-0 focus-visible:ring-0"
                                            value={settings.minInterestRate}
                                            onChange={(e) => setSettings({ ...settings, minInterestRate: parseFloat(e.target.value) || 0 })}
                                        />
                                        <span className="font-bold text-slate-400">%</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">Maximum Allowed Rate</span>
                                        <span className="text-xs text-slate-400">Higher bound for custom plans</span>
                                    </div>
                                    <div className="w-32 flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                        <Input 
                                            type="number"
                                            className="h-8 border-none bg-transparent font-black text-right p-0 focus-visible:ring-0"
                                            value={settings.maxInterestRate}
                                            onChange={(e) => setSettings({ ...settings, maxInterestRate: parseFloat(e.target.value) || 0 })}
                                        />
                                        <span className="font-bold text-slate-400">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lease Terms List - One line design */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 px-1">
                                <Clock className="w-5 h-5 text-slate-400" />
                                <h2 className="text-xl font-bold text-slate-900">Lease Terms</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">Min. Loan Duration</span>
                                        <span className="text-xs text-slate-400">Shortest period in months</span>
                                    </div>
                                    <div className="w-32 flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                        <Input 
                                            type="number"
                                            className="h-8 border-none bg-transparent font-black text-right p-0 focus-visible:ring-0"
                                            value={settings.minLoanDuration}
                                            onChange={(e) => setSettings({ ...settings, minLoanDuration: parseInt(e.target.value) || 1 })}
                                        />
                                        <span className="font-bold text-slate-400 text-[10px] uppercase">Mo</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">Max. Loan Duration</span>
                                        <span className="text-xs text-slate-400">Longest period in months</span>
                                    </div>
                                    <div className="w-32 flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                        <Input 
                                            type="number"
                                            className="h-8 border-none bg-transparent font-black text-right p-0 focus-visible:ring-0"
                                            value={settings.maxLoanDuration}
                                            onChange={(e) => setSettings({ ...settings, maxLoanDuration: parseInt(e.target.value) || 1 })}
                                        />
                                        <span className="font-bold text-slate-400 text-[10px] uppercase">Mo</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">Min. Down Payment</span>
                                        <span className="text-xs text-slate-400">Percentage required upfront</span>
                                    </div>
                                    <div className="w-32 flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                        <Input 
                                            type="number"
                                            className="h-8 border-none bg-transparent font-black text-right p-0 focus-visible:ring-0"
                                            value={settings.minDownPaymentPercentage}
                                            onChange={(e) => setSettings({ ...settings, minDownPaymentPercentage: parseInt(e.target.value) || 0 })}
                                        />
                                        <span className="font-bold text-slate-400">%</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">Processing Fee</span>
                                        <span className="text-xs text-slate-400">Standard application cost</span>
                                    </div>
                                    <div className="w-48 flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                        <Input 
                                            type="number"
                                            className="h-8 border-none bg-transparent font-black text-right p-0 focus-visible:ring-0"
                                            value={settings.processingFee}
                                            onChange={(e) => setSettings({ ...settings, processingFee: parseInt(e.target.value) || 0 })}
                                        />
                                        <span className="font-bold text-slate-400 text-[10px] uppercase shrink-0">LKR</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Company Info List - One line design */}
                        <div className="lg:col-span-2 space-y-6 pt-4">
                            <div className="flex items-center gap-2 px-1">
                                <Building2 className="w-5 h-5 text-slate-400" />
                                <h2 className="text-xl font-bold text-slate-900">Company Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">Company Name</span>
                                    </div>
                                    <Input 
                                        className="h-9 w-48 border-slate-100 bg-slate-50 font-medium text-right text-xs"
                                        value={settings.companyName}
                                        onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">Support Email</span>
                                    </div>
                                    <Input 
                                        className="h-9 w-48 border-slate-100 bg-slate-50 font-medium text-right text-xs"
                                        value={settings.companyEmail}
                                        onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary/20 transition-all md:col-span-2 text-primary font-bold">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">Hotline</span>
                                    </div>
                                    <Input 
                                        className="h-9 w-64 border-slate-100 bg-slate-50 font-medium text-right text-xs"
                                        value={settings.companyPhone}
                                        onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ClockProps extends React.SVGProps<SVGSVGElement> {}
const Clock = (props: ClockProps) => (
    <svg 
        {...props} 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export default FinanceSettings;
