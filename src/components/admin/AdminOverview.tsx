// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Car, FileText, Users, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
// import { useEffect, useState } from "react";
// import { VehicleListing, LeaseApplication } from "@/types";

// const AdminOverview = () => {
//     const [stats, setStats] = useState({
//         totalVehicles: 0,
//         pendingVehicles: 0,
//         approvedVehicles: 0,
//         totalApplications: 0,
//         pendingApplications: 0,
//         approvedApplications: 0,
//         rejectedApplications: 0,
//         totalUsers: 0,
//     });

//     const [recentApplications, setRecentApplications] = useState<LeaseApplication[]>([]);
//     const [recentVehicles, setRecentVehicles] = useState<VehicleListing[]>([]);
//     const [userRole, setUserRole] = useState<string>("");

//     useEffect(() => {
//         // Load data from localStorage
//         const vehicles: VehicleListing[] = JSON.parse(localStorage.getItem("listings") || "[]");
//         let applications: LeaseApplication[] = JSON.parse(localStorage.getItem("leaseApplications") || "[]");
//         const users = JSON.parse(localStorage.getItem("users") || "[]");
//         const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
//         setUserRole(currentUser.role || "");

//         // Filter applications for Branch Managers
//         if (currentUser.role === "branch-manager" && currentUser.branchId) {
//             const branches = JSON.parse(localStorage.getItem("branches") || "[]");
//             const userBranch = branches.find((b: any) => b.id === currentUser.branchId);

//             if (userBranch) {
//                 applications = applications.filter(app =>
//                     app.assignedBranchId === currentUser.branchId ||
//                     app.location.town === userBranch.location.town
//                 );
//             }
//         }

//         // Calculate stats
//         setStats({
//             totalVehicles: vehicles.length,
//             pendingVehicles: vehicles.filter((v) => v.status === "pending").length,
//             approvedVehicles: vehicles.filter((v) => v.status === "approved").length,
//             totalApplications: applications.length,
//             pendingApplications: applications.filter((a) => a.status === "pending").length,
//             approvedApplications: applications.filter((a) => a.status === "approved").length,
//             rejectedApplications: applications.filter((a) => a.status === "rejected").length,
//             totalUsers: users.length + 1, // +1 for current user
//         });

//         // Recent applications (last 5)
//         setRecentApplications(applications.slice(0, 5));

//         // Recent vehicles (last 5)
//         setRecentVehicles(vehicles.slice(0, 5));
//     }, []);

//     const StatCard = ({ title, value, icon: Icon, color }: any) => (
//         <Card>
//             <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <p className="text-sm text-muted-foreground mb-1">{title}</p>
//                         <p className="text-3xl font-bold">{value}</p>
//                     </div>
//                     <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/20`}>
//                         <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     );

//     return (
//         <div className="space-y-4 md:space-y-6">
//             <div>
//                 <h1 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h1>
//                 <p className="text-muted-foreground mt-1 text-sm md:text-base">Welcome to the admin dashboard</p>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//                 <Card className="border-l-4 border-l-primary">
//                     <CardContent className="p-4 md:p-6">
//                         <div className="flex items-center justify-between">
//                             <div className="flex-1 min-w-0">
//                                 <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Vehicles</p>
//                                 <p className="text-2xl md:text-3xl font-bold">{stats.totalVehicles}</p>
//                                 <p className="text-xs text-muted-foreground mt-1">
//                                     {stats.pendingVehicles} pending approval
//                                 </p>
//                             </div>
//                             <div className="p-2 md:p-3 rounded-full bg-primary/10 flex-shrink-0 ml-2">
//                                 <Car className="w-5 h-5 md:w-6 md:h-6 text-primary" />
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {userRole !== "ad-manager" && (
//                     <>
//                         <Card className="border-l-4 border-l-blue-500">
//                             <CardContent className="p-4 md:p-6">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Applications</p>
//                                         <p className="text-2xl md:text-3xl font-bold">{stats.totalApplications}</p>
//                                         <p className="text-xs text-muted-foreground mt-1">
//                                             {stats.pendingApplications} pending review
//                                         </p>
//                                     </div>
//                                     <div className="p-2 md:p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 flex-shrink-0 ml-2">
//                                         <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         <Card className="border-l-4 border-l-green-500">
//                             <CardContent className="p-4 md:p-6">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-xs md:text-sm text-muted-foreground mb-1">Approved Applications</p>
//                                         <p className="text-2xl md:text-3xl font-bold">{stats.approvedApplications}</p>
//                                         <p className="text-xs text-muted-foreground mt-1">
//                                             {((stats.approvedApplications / stats.totalApplications) * 100 || 0).toFixed(1)}% approval rate
//                                         </p>
//                                     </div>
//                                     <div className="p-2 md:p-3 rounded-full bg-green-100 dark:bg-green-900/20 flex-shrink-0 ml-2">
//                                         <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         <Card className="border-l-4 border-l-purple-500">
//                             <CardContent className="p-4 md:p-6">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Users</p>
//                                         <p className="text-2xl md:text-3xl font-bold">{stats.totalUsers}</p>
//                                         <p className="text-xs text-muted-foreground mt-1">
//                                             Active platform users
//                                         </p>
//                                     </div>
//                                     <div className="p-2 md:p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 flex-shrink-0 ml-2">
//                                         <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </>
//                 )}
//             </div>

//             {/* Recent Activity */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
//                 {/* Recent Applications */}
//                 {userRole !== "ad-manager" && (
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                                 <Clock className="w-5 h-5" />
//                                 Recent Lease Applications
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             {recentApplications.length === 0 ? (
//                                 <p className="text-sm text-muted-foreground text-center py-8">
//                                     No applications yet
//                                 </p>
//                             ) : (
//                                 <div className="space-y-3">
//                                     {recentApplications.map((app) => (
//                                         <div
//                                             key={app.id}
//                                             className="flex items-center justify-between p-2 md:p-3 bg-muted/50 rounded-lg gap-2"
//                                         >
//                                             <div className="flex-1 min-w-0">
//                                                 <p className="font-medium text-sm md:text-base line-clamp-1">{app.fullName}</p>
//                                                 <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
//                                                     {app.vehicleTitle}
//                                                 </p>
//                                                 <p className="text-xs text-muted-foreground">
//                                                     {new Date(app.submittedAt).toLocaleDateString()}
//                                                 </p>
//                                             </div>
//                                             <div className="flex-shrink-0">
//                                                 {app.status === "pending" && (
//                                                     <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
//                                                         Pending
//                                                     </span>
//                                                 )}
//                                                 {app.status === "approved" && (
//                                                     <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
//                                                         Approved
//                                                     </span>
//                                                 )}
//                                                 {app.status === "rejected" && (
//                                                     <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
//                                                         Rejected
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 )}

//                 {/* Recent Vehicles */}
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <TrendingUp className="w-5 h-5" />
//                             Recent Vehicle Postings
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         {recentVehicles.length === 0 ? (
//                             <p className="text-sm text-muted-foreground text-center py-8">
//                                 No vehicles posted yet
//                             </p>
//                         ) : (
//                             <div className="space-y-3">
//                                 {recentVehicles.map((vehicle) => (
//                                     <div
//                                         key={vehicle.id}
//                                         className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-muted/50 rounded-lg"
//                                     >
//                                         <img
//                                             src={vehicle.images[0]}
//                                             alt={vehicle.title}
//                                             className="w-12 h-12 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
//                                         />
//                                         <div className="flex-1 min-w-0">
//                                             <p className="font-medium text-sm md:text-base line-clamp-1">{vehicle.title}</p>
//                                             <p className="text-xs md:text-sm text-primary font-semibold">
//                                                 {new Intl.NumberFormat("en-LK", {
//                                                     style: "currency",
//                                                     currency: "LKR",
//                                                     minimumFractionDigits: 0,
//                                                 }).format(vehicle.price)}
//                                             </p>
//                                         </div>
//                                         <div className="flex-shrink-0">
//                                             {vehicle.status === "pending" && (
//                                                 <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
//                                                     Pending
//                                                 </span>
//                                             )}
//                                             {vehicle.status === "approved" && (
//                                                 <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
//                                                     Approved
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default AdminOverview;
