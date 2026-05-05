"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileMenu from "@/components/admin/AdminMobileMenu";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, Download, Smartphone, Tablet, Monitor, X } from "lucide-react";
import { AdBannerData } from "@/components/AdBanner";
import { seedDemoAds, forceSeedDemoAds } from "@/data/demoAds";

const AdminAds = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [ads, setAds] = useState<AdBannerData[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<AdBannerData | null>(null);
    const [previewAd, setPreviewAd] = useState<AdBannerData | null>(null);
    const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "laptop">("laptop");
    const [formData, setFormData] = useState<Partial<AdBannerData>>({
        title: "",
        description: "",
        imageUrl: "",
        linkUrl: "",
        advertiser: "",
        type: "banner",
        position: "",
        enabled: true,
    });

    useEffect(() => {
        const user = localStorage.getItem("currentUser");
        if (!user) {
            toast({ title: "Access Denied", description: "Please sign in to access the admin dashboard", variant: "destructive" });
            router.push("/auth");
            return;
        }

        const parsedUser = JSON.parse(user);
        const hasAdminAccess =
            parsedUser.email === "admin@tradehub.lk" ||
            parsedUser.role === "super-admin" ||
            parsedUser.role === "admin" ||
            parsedUser.role === "ad-manager" ||
            parsedUser.isAdmin === true;

        if (!hasAdminAccess) {
            toast({ title: "Access Denied", description: "You don't have permission to access the admin dashboard", variant: "destructive" });
            router.push("/");
            return;
        }

        setCurrentUser(parsedUser);
        loadAds();

        const storedAds = localStorage.getItem("adBanners");
        if (!storedAds || JSON.parse(storedAds).length === 0) {
            seedDemoAds();
            loadAds();
        }
    }, [router, toast]);

    const loadAds = () => {
        const storedAds = JSON.parse(localStorage.getItem("adBanners") || "[]");
        setAds(storedAds);
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        toast({ title: "Logged out", description: "You have been successfully logged out" });
        router.push("/auth");
    };

    const handleOpenDialog = (ad?: AdBannerData) => {
        if (ad) {
            setEditingAd(ad);
            setFormData(ad);
        } else {
            setEditingAd(null);
            setFormData({ title: "", description: "", imageUrl: "", linkUrl: "", advertiser: "", type: "banner", position: "", enabled: true });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingAd(null);
        setFormData({ title: "", description: "", imageUrl: "", linkUrl: "", advertiser: "", type: "banner", position: "", enabled: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.imageUrl || !formData.linkUrl || !formData.position) {
            toast({ title: "Validation Error", description: "Please fill in all required fields", variant: "destructive" });
            return;
        }

        const updatedAds = [...ads];
        if (editingAd) {
            const index = updatedAds.findIndex((ad) => ad.id === editingAd.id);
            if (index !== -1) {
                updatedAds[index] = { ...formData, id: editingAd.id, updatedAt: new Date().toISOString() } as AdBannerData;
            }
            toast({ title: "Ad Updated", description: "The ad has been successfully updated" });
        } else {
            const newAd: AdBannerData = {
                ...formData,
                id: `ad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as AdBannerData;
            updatedAds.push(newAd);
            toast({ title: "Ad Created", description: "The ad has been successfully created" });
        }

        localStorage.setItem("adBanners", JSON.stringify(updatedAds));
        loadAds();
        handleCloseDialog();
    };

    const handleDelete = (id: string) => {
        const updatedAds = ads.filter((ad) => ad.id !== id);
        localStorage.setItem("adBanners", JSON.stringify(updatedAds));
        loadAds();
        toast({ title: "Ad Deleted", description: "The ad has been successfully deleted" });
    };

    const handleToggleEnabled = (id: string) => {
        const updatedAds = ads.map((ad) => ad.id === id ? { ...ad, enabled: !ad.enabled } : ad);
        localStorage.setItem("adBanners", JSON.stringify(updatedAds));
        loadAds();
        toast({ title: "Ad Status Updated", description: `Ad has been ${updatedAds.find((ad) => ad.id === id)?.enabled ? "enabled" : "disabled"}` });
    };

    const getPositionOptions = () => [
        "after-hero", "before-featured", "after-featured", "after-types", "before-cta", "before-footer",
    ];

    const deviceConfig = {
        mobile:  { width: 390,  label: "iPhone 14",      icon: Smartphone, scale: 0.72 },
        tablet:  { width: 768,  label: "iPad",            icon: Tablet,     scale: 0.62 },
        laptop:  { width: 1280, label: "MacBook Pro 13",  icon: Monitor,    scale: 0.52 },
    };

    if (!currentUser) return null;

    return (
        <>
            <div className="min-h-screen bg-background">
                <div className="flex h-screen overflow-hidden">
                    <AdminSidebar onLogout={handleLogout} />
                    <AdminMobileMenu onLogout={handleLogout} />

                    <div className="flex-1 overflow-y-auto">
                        <div className="container mx-auto p-4 md:p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold">Ad Management</h1>
                                    <p className="text-muted-foreground mt-1">Manage advertisement banners across the website</p>
                                </div>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => handleOpenDialog()}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Ad
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>{editingAd ? "Edit Ad" : "Create New Ad"}</DialogTitle>
                                            <DialogDescription>
                                                {editingAd ? "Update the ad details below" : "Fill in the details to create a new advertisement banner"}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit}>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                                                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter ad title" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="advertiser">Advertiser Name</Label>
                                                    <Input id="advertiser" value={formData.advertiser || ""} onChange={(e) => setFormData({ ...formData, advertiser: e.target.value })} placeholder="Enter advertiser name" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea id="description" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter ad description" rows={3} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="type">Ad Type <span className="text-destructive">*</span></Label>
                                                        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                                                            <SelectTrigger><SelectValue placeholder="Select ad type" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="banner">Banner</SelectItem>
                                                                <SelectItem value="rectangle">Rectangle</SelectItem>
                                                                <SelectItem value="square">Square</SelectItem>
                                                                <SelectItem value="skyscraper">Skyscraper</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="position">Position <span className="text-destructive">*</span></Label>
                                                        <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                                                            <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                                                            <SelectContent>
                                                                {getPositionOptions().map((pos) => (
                                                                    <SelectItem key={pos} value={pos}>
                                                                        {pos.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="imageUrl">Image URL <span className="text-destructive">*</span></Label>
                                                    <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="linkUrl">Link URL <span className="text-destructive">*</span></Label>
                                                    <Input id="linkUrl" value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} placeholder="https://example.com" required />
                                                </div>
                                                {formData.imageUrl && (
                                                    <div className="space-y-2">
                                                        <Label>Preview</Label>
                                                        <div className="border rounded-lg overflow-hidden">
                                                            <img
                                                                src={formData.imageUrl}
                                                                alt="Preview"
                                                                className="w-full h-48 object-cover"
                                                                onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400?text=Invalid+Image+URL"; }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                                                <Button type="submit">{editingAd ? "Update" : "Create"}</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {ads.length === 0 ? (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <ExternalLink className="w-12 h-12 text-muted-foreground mb-4" />
                                        <CardTitle className="mb-2">No Ads Found</CardTitle>
                                        <CardDescription className="mb-4">
                                            Create your first advertisement banner or seed demo ads to get started
                                        </CardDescription>
                                        <div className="flex gap-2 justify-center">
                                            <Button onClick={() => handleOpenDialog()}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create Ad
                                            </Button>
                                            <Button variant="outline" onClick={() => { forceSeedDemoAds(); loadAds(); toast({ title: "Demo Ads Seeded", description: "Demo advertisement banners have been added" }); }}>
                                                <Download className="w-4 h-4 mr-2" />
                                                Seed Demo Ads
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <>
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <Card>
                                            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Total Ads</CardTitle></CardHeader>
                                            <CardContent>
                                                <div className="text-3xl font-bold">{ads.length}</div>
                                                <p className="text-xs text-muted-foreground mt-1">All advertisement banners</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Enabled Ads</CardTitle></CardHeader>
                                            <CardContent>
                                                <div className="text-3xl font-bold text-green-600">{ads.filter(ad => ad.enabled !== false).length}</div>
                                                <p className="text-xs text-muted-foreground mt-1">Currently active</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Positions Used</CardTitle></CardHeader>
                                            <CardContent>
                                                <div className="text-3xl font-bold text-primary">{new Set(ads.map(ad => ad.position).filter(Boolean)).size}</div>
                                                <p className="text-xs text-muted-foreground mt-1">Unique positions</p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Position Summary */}
                                    <Card className="mb-6">
                                        <CardHeader>
                                            <CardTitle>Ads by Position</CardTitle>
                                            <CardDescription>View how many ads are assigned to each position</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                {getPositionOptions().map((position) => {
                                                    const positionAds = ads.filter(ad => ad.position === position && ad.enabled !== false);
                                                    const totalPositionAds = ads.filter(ad => ad.position === position);
                                                    return (
                                                        <div key={position} className="border rounded-lg p-4">
                                                            <p className="text-sm font-medium mb-2">
                                                                {position.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                            </p>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs text-muted-foreground">Enabled:</span>
                                                                    <Badge variant="default" className="text-xs">{positionAds.length}</Badge>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs text-muted-foreground">Total:</span>
                                                                    <Badge variant="secondary" className="text-xs">{totalPositionAds.length}</Badge>
                                                                </div>
                                                                {positionAds.length > 1 && (
                                                                    <p className="text-xs text-primary mt-2 font-medium">✓ Carousel enabled</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>All Ads ({ads.length})</CardTitle>
                                            <CardDescription>
                                                Manage and monitor all advertisement banners. Click <Monitor className="inline w-3 h-3 text-blue-500" /> to preview on Mobile, Tablet, or Laptop.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Title</TableHead>
                                                        <TableHead>Advertiser</TableHead>
                                                        <TableHead>Type</TableHead>
                                                        <TableHead>Position</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {ads.map((ad) => {
                                                        const positionCount = ads.filter(a => a.position === ad.position && a.enabled !== false).length;
                                                        return (
                                                            <TableRow key={ad.id}>
                                                                <TableCell className="font-medium">{ad.title}</TableCell>
                                                                <TableCell>{ad.advertiser || "N/A"}</TableCell>
                                                                <TableCell><Badge variant="outline">{ad.type}</Badge></TableCell>
                                                                <TableCell>
                                                                    <div className="flex flex-col gap-1">
                                                                        <Badge variant="secondary">
                                                                            {ad.position?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                                        </Badge>
                                                                        {positionCount > 1 && (
                                                                            <span className="text-xs text-muted-foreground">{positionCount} ads in carousel</span>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant={ad.enabled !== false ? "default" : "secondary"}>
                                                                        {ad.enabled !== false ? "Enabled" : "Disabled"}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-1.5">
                                                                        {/* Toggle Enable/Disable */}
                                                                        <Button variant="ghost" size="icon" onClick={() => handleToggleEnabled(ad.id)} title={ad.enabled !== false ? "Disable" : "Enable"}>
                                                                            {ad.enabled !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                                        </Button>
                                                                        {/* Device Preview */}
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => { setPreviewAd(ad); setPreviewDevice("laptop"); }}
                                                                            title="Preview on Mobile / Tablet / Laptop"
                                                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                                        >
                                                                            <Monitor className="w-4 h-4" />
                                                                        </Button>
                                                                        {/* Edit */}
                                                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(ad)}>
                                                                            <Edit className="w-4 h-4" />
                                                                        </Button>
                                                                        {/* Delete */}
                                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(ad.id)} className="text-destructive hover:text-destructive">
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Device Preview Modal ─── */}
            {previewAd && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setPreviewAd(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Device Preview</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Viewing: <span className="font-semibold text-primary">{previewAd.title}</span>
                                    {" · "}Position: <span className="font-semibold">{previewAd.position?.replace(/-/g, " ")}</span>
                                </p>
                            </div>
                            <button onClick={() => setPreviewAd(null)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        {/* Device Switcher Toolbar */}
                        <div className="flex items-center justify-center gap-3 px-6 py-4 border-b bg-white">
                            {(["mobile", "tablet", "laptop"] as const).map((device) => {
                                const cfg = deviceConfig[device];
                                const Icon = cfg.icon;
                                const isActive = previewDevice === device;
                                return (
                                    <button
                                        key={device}
                                        onClick={() => setPreviewDevice(device)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                                            isActive
                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="capitalize">{device}</span>
                                        <span className={`text-[10px] font-normal ${isActive ? "text-white/70" : "text-slate-400"}`}>{cfg.width}px</span>
                                    </button>
                                );
                            })}
                            <div className="ml-4 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-xs font-semibold text-amber-700">{deviceConfig[previewDevice].label}</span>
                            </div>
                        </div>

                        {/* Preview Area */}
                        <div className="flex-1 overflow-auto bg-slate-100 flex items-start justify-center py-8 px-4" style={{ minHeight: 400 }}>
                            <div
                                className="relative bg-white shadow-2xl transition-all duration-500 mx-auto"
                                style={{
                                    width: deviceConfig[previewDevice].width,
                                    minHeight: previewDevice === "mobile" ? 700 : previewDevice === "tablet" ? 900 : 640,
                                    borderRadius: previewDevice === "mobile" ? 32 : previewDevice === "tablet" ? 20 : 8,
                                    border: `${previewDevice === "laptop" ? 12 : 8}px solid #1e293b`,
                                    boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
                                    transform: `scale(${deviceConfig[previewDevice].scale})`,
                                    transformOrigin: "top center",
                                    flexShrink: 0,
                                }}
                            >
                                {/* Mobile Notch */}
                                {previewDevice === "mobile" && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-2xl z-10 flex items-center justify-center">
                                        <div className="w-10 h-1.5 bg-slate-700 rounded-full" />
                                    </div>
                                )}
                                {/* Tablet Camera */}
                                {previewDevice === "tablet" && (
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-700 rounded-full z-10" />
                                )}
                                {/* Laptop Webcam */}
                                {previewDevice === "laptop" && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-700 rounded-full z-10" />
                                )}
                                <iframe
                                    src="/"
                                    width="100%"
                                    height={previewDevice === "mobile" ? 700 : previewDevice === "tablet" ? 900 : 640}
                                    className="border-none block"
                                    style={{ borderRadius: previewDevice === "mobile" ? 24 : previewDevice === "tablet" ? 12 : 0, background: "white" }}
                                    title={`Ad preview on ${previewDevice}`}
                                />
                            </div>
                        </div>

                        {/* Footer Info Bar */}
                        <div className="px-6 py-3 border-t bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                <span>📐 Viewport: <strong>{deviceConfig[previewDevice].width}px</strong></span>
                                <span>🖼️ Position: <strong>{previewAd.position}</strong></span>
                                <span>📦 Type: <strong>{previewAd.type}</strong></span>
                                <span className={`px-2 py-0.5 rounded-full font-semibold ${previewAd.enabled !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {previewAd.enabled !== false ? "● Active" : "○ Inactive"}
                                </span>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => setPreviewAd(null)}>Close Preview</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminAds;
