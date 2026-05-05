// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import {
//     Pagination,
//     PaginationContent,
//     PaginationEllipsis,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
// } from "@/components/ui/pagination";
// import { LeaseApplication } from "@/types";
// import LocationSelector from "@/components/LocationSelector";
// import { filterByLocation } from "@/lib/locationUtils";
// import { Label } from "@/components/ui/label";
// import { Search, Eye, CheckCircle, XCircle, Clock, Filter, X, Download } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { usePagination } from "@/hooks/usePagination";
// import jsPDF from "jspdf";
// import { trackLeaseApplicationStatusChange } from "@/lib/analytics";

// const AdminLeaseApplications = () => {
//     const { toast } = useToast();
//     const [applications, setApplications] = useState<LeaseApplication[]>([]);
//     const [filteredApplications, setFilteredApplications] = useState<LeaseApplication[]>([]);
//     const [selectedApplication, setSelectedApplication] = useState<LeaseApplication | null>(null);
//     const [detailsOpen, setDetailsOpen] = useState(false);

//     // Filters
//     const [statusFilter, setStatusFilter] = useState("");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [locationFilter, setLocationFilter] = useState({
//         province: "",
//         district: "",
//         town: "",
//     });

//     useEffect(() => {
//         loadApplications();
//     }, []);

//     const loadApplications = () => {
//         const stored = localStorage.getItem("leaseApplications");
//         if (stored) {
//             setApplications(JSON.parse(stored));
//         }
//     };

//     useEffect(() => {
//         const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
//         let filtered = [...applications];

//         // Role-based filtering for Branch Managers
//         if (user.role === "branch-manager" && user.branchId) {
//             const branches = JSON.parse(localStorage.getItem("branches") || "[]");
//             const userBranch = branches.find((b: any) => b.id === user.branchId);

//             if (userBranch) {
//                 // Filter by assigned branch ID OR location match
//                 filtered = filtered.filter(app =>
//                     app.assignedBranchId === user.branchId ||
//                     app.location.town === userBranch.location.town
//                 );
//             }
//         }

//         // Search filter
//         if (searchQuery) {
//             filtered = filtered.filter(
//                 (app) =>
//                     app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                     app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                     app.phoneNumber.includes(searchQuery) ||
//                     app.vehicleTitle.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }

//         // Status filter
//         if (statusFilter) {
//             filtered = filtered.filter((app) => app.status === statusFilter);
//         }

//         // Location filter - Province/District/Town as requested
//         if (locationFilter.province || locationFilter.district || locationFilter.town) {
//             filtered = filterByLocation(filtered, {
//                 province: locationFilter.province || undefined,
//                 district: locationFilter.district || undefined,
//                 town: locationFilter.town || undefined,
//             });
//         }

//         setFilteredApplications(filtered);
//     }, [applications, searchQuery, statusFilter, locationFilter]);

//     const updateApplicationStatus = (applicationId: string, newStatus: "approved" | "rejected" | "in-review") => {
//         const application = applications.find(app => app.id === applicationId);
//         const oldStatus = application?.status || "pending";

//         const updated = applications.map((app) =>
//             app.id === applicationId
//                 ? { ...app, status: newStatus, reviewedAt: new Date().toISOString() }
//                 : app
//         );

//         setApplications(updated);
//         localStorage.setItem("leaseApplications", JSON.stringify(updated));

//         // Track status change
//         if (application) {
//             trackLeaseApplicationStatusChange(applicationId, oldStatus, newStatus);
//         }

//         toast({
//             title: "Status Updated",
//             description: `Application has been marked as ${newStatus}`,
//         });

//         setDetailsOpen(false);
//     };

//     const formatCurrency = (amount: number) => {
//         return new Intl.NumberFormat("en-LK", {
//             style: "currency",
//             currency: "LKR",
//             minimumFractionDigits: 0,
//         }).format(amount);
//     };

//     const downloadApplication = (application: LeaseApplication) => {
//         const formatDate = (dateString: string) => {
//             return new Date(dateString).toLocaleString("en-LK", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//             });
//         };

//         // Create PDF document
//         const doc = new jsPDF();
//         let yPosition = 20;
//         const pageWidth = doc.internal.pageSize.getWidth();
//         const margin = 20;
//         const maxWidth = pageWidth - (margin * 2);
//         const lineHeight = 7;

//         // Helper function to add text with word wrap
//         const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
//             doc.setFontSize(fontSize);
//             doc.setTextColor(color[0], color[1], color[2]);
//             if (isBold) {
//                 doc.setFont(undefined, "bold");
//             } else {
//                 doc.setFont(undefined, "normal");
//             }
            
//             const lines = doc.splitTextToSize(text, maxWidth);
//             lines.forEach((line: string) => {
//                 if (yPosition > 270) {
//                     doc.addPage();
//                     yPosition = 20;
//                 }
//                 doc.text(line, margin, yPosition);
//                 yPosition += lineHeight;
//             });
//             yPosition += 2;
//         };

//         // Header
//         doc.setTextColor(0, 0, 0);
//         doc.setFontSize(18);
//         doc.setFont(undefined, "bold");
//         doc.text("LEASE APPLICATION DETAILS", pageWidth / 2, yPosition, { align: "center" });
//         yPosition += 10;

//         // Application Info
//         addText("Application Information", 12, true);
//         addText(`Application ID: ${application.id}`, 10);
//         addText(`Application Date: ${formatDate(application.submittedAt)}`, 10);
//         addText(`Status: ${application.status.charAt(0).toUpperCase() + application.status.slice(1).toLowerCase()}`, 10);
//         if (application.reviewedAt) {
//             addText(`Reviewed At: ${formatDate(application.reviewedAt)}`, 10);
//         }
//         yPosition += 5;

//         // Vehicle Information
//         addText("Vehicle Information", 12, true);
//         addText(`Vehicle: ${application.vehicleTitle}`, 10);
//         addText(`Vehicle ID: ${application.vehicleId}`, 10);
//         addText(`Price: ${formatCurrency(application.vehiclePrice)}`, 10);
//         yPosition += 5;

//         // Personal Information
//         addText("Personal Information", 12, true);
//         addText(`Full Name: ${application.fullName}`, 10);
//         addText(`NIC: ${application.nic}`, 10);
//         addText(`Date of Birth: ${new Date(application.dateOfBirth).toLocaleDateString("en-LK")}`, 10);
//         addText(`Email: ${application.email}`, 10);
//         addText(`Phone: ${application.phoneNumber}`, 10);
//         addText(`Address: ${application.address}`, 10);
//         addText(`Location: ${application.location.town}, ${application.location.district}, ${application.location.province}`, 10);
//         yPosition += 5;

//         // Employment Information
//         addText("Employment Information", 12, true);
//         addText(`Employment Status: ${application.employmentStatus}`, 10);
//         if (application.employerName) {
//             addText(`Employer: ${application.employerName}`, 10);
//         }
//         addText(`Occupation: ${application.occupation}`, 10);
//         addText(`Employment Duration: ${application.employmentDuration}`, 10);
//         addText(`Monthly Income: ${formatCurrency(application.monthlyIncome)}`, 10);
//         yPosition += 5;

//         // Loan Details
//         addText("Loan Details", 12, true);
//         addText(`Down Payment: ${formatCurrency(application.downPayment)}`, 10);
//         addText(`Loan Amount: ${formatCurrency(application.loanAmount)}`, 10);
//         addText(`Loan Duration: ${application.loanDuration} months`, 10);
//         addText(`Interest Rate: ${application.interestRate}%`, 10);
//         addText(`Monthly Payment: ${formatCurrency(application.monthlyPayment)}`, 10, true, [0, 100, 0]);
//         yPosition += 5;

//         // References
//         if (application.referenceContact1 || application.referenceContact2) {
//             addText("References", 12, true);
//             if (application.referenceContact1) {
//                 addText(`Reference 1: ${application.referenceContact1}`, 10);
//             }
//             if (application.referenceContact2) {
//                 addText(`Reference 2: ${application.referenceContact2}`, 10);
//             }
//             yPosition += 5;
//         }

//         // Applicant Notes
//         if (application.applicantNotes) {
//             addText("Applicant Notes", 12, true);
//             addText(application.applicantNotes, 10);
//             yPosition += 5;
//         }

//         // Admin Notes
//         if (application.adminNotes) {
//             addText("Admin Notes", 12, true);
//             addText(application.adminNotes, 10);
//             yPosition += 5;
//         }

//         // Footer
//         yPosition = 280;
//         doc.setFontSize(8);
//         doc.setTextColor(128, 128, 128);
//         doc.setFont(undefined, "normal");
//         doc.text(`Generated on: ${new Date().toLocaleString("en-LK")}`, pageWidth / 2, yPosition, { align: "center" });
//         yPosition += 5;
//         doc.text("TradeHub.lk - Vehicle Leasing Platform", pageWidth / 2, yPosition, { align: "center" });

//         // Save PDF
//         const fileName = `lease-application-${application.id}-${application.fullName.replace(/\s+/g, "-")}.pdf`;
//         doc.save(fileName);

//         toast({
//             title: "Application Downloaded",
//             description: "The application details have been downloaded as PDF successfully.",
//         });
//     };

//     const getStatusBadge = (status: string) => {
//         switch (status) {
//             case "pending":
//                 return <Badge className="bg-yellow-500">Pending</Badge>;
//             case "in-review":
//                 return <Badge className="bg-blue-500">In Review</Badge>;
//             case "approved":
//                 return <Badge className="bg-green-500">Approved</Badge>;
//             case "rejected":
//                 return <Badge className="bg-red-500">Rejected</Badge>;
//             case "cancelled":
//                 return <Badge className="bg-gray-500">Cancelled</Badge>;
//             default:
//                 return <Badge>{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</Badge>;
//         }
//     };

//     const pagination = usePagination({ data: filteredApplications, itemsPerPage: 10 });

//     return (
//         <div className="space-y-4 md:space-y-6">
//             <div>
//                 <h1 className="text-2xl md:text-3xl font-bold">Lease Applications</h1>
//                 <p className="text-muted-foreground mt-1 text-sm md:text-base">
//                     Manage and review vehicle lease applications
//                 </p>
//             </div>

//             {/* Filters */}
//             <Card>
//                 <CardHeader className="border-b p-4 md:p-6">
//                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//                         <div className="flex items-center gap-2">
//                             <Filter className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
//                             <CardTitle className="text-base md:text-lg">Filter Applications</CardTitle>
//                         </div>
//                         {(searchQuery || statusFilter || locationFilter.province || locationFilter.district || locationFilter.town) && (
//                             <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => {
//                                     setSearchQuery("");
//                                     setStatusFilter("");
//                                     setLocationFilter({ province: "", district: "", town: "" });
//                                 }}
//                                 className="text-muted-foreground hover:text-foreground"
//                             >
//                                 <X className="w-4 h-4 mr-2" />
//                                 Clear All
//                             </Button>
//                         )}
//                     </div>
//                 </CardHeader>
//                 <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
//                     <div className="space-y-4 md:space-y-6">
//                         {/* Search */}
//                         <div className="space-y-2">
//                             <Label htmlFor="search" className="text-sm font-medium">
//                                 Search Applications
//                             </Label>
//                             <div className="relative">
//                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//                                 <Input
//                                     id="search"
//                                     placeholder="Search by applicant name, email, phone, or vehicle..."
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     className="pl-10"
//                                 />
//                             </div>
//                         </div>

//                         {/* Status and Location Filters */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {/* Status Filter */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="status-filter" className="text-sm font-medium">
//                                     Application Status
//                                 </Label>
//                                 <Select 
//                                     value={statusFilter || "all"} 
//                                     onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}
//                                 >
//                                     <SelectTrigger id="status-filter">
//                                         <SelectValue placeholder="Select status..." />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="all">All Statuses</SelectItem>
//                                         <SelectItem value="pending">Pending</SelectItem>
//                                         <SelectItem value="in-review">In Review</SelectItem>
//                                         <SelectItem value="approved">Approved</SelectItem>
//                                         <SelectItem value="rejected">Rejected</SelectItem>
//                                         <SelectItem value="cancelled">Cancelled</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             {/* Location Filter Section */}
//                             <div className="space-y-2">
//                                 <Label className="text-sm font-medium">
//                                     Location
//                                 </Label>
//                                 <LocationSelector
//                                     value={locationFilter}
//                                     onChange={setLocationFilter}
//                                     showLabels={false}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* Applications Table */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="flex items-center justify-between">
//                         <span>Applications ({filteredApplications.length})</span>
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     {filteredApplications.length === 0 ? (
//                         <div className="text-center py-12">
//                             <p className="text-muted-foreground">No applications found</p>
//                         </div>
//                     ) : (
//                         <>
//                             <div className="mb-4 text-xs md:text-sm text-muted-foreground">
//                                 Showing {pagination.startIndex} to {pagination.endIndex} of {pagination.totalItems} applications
//                             </div>
                            
//                             {/* Mobile Card View */}
//                             <div className="md:hidden space-y-4">
//                                 {pagination.paginatedData.map((app) => (
//                                     <Card key={app.id}>
//                                         <CardContent className="p-4 space-y-3">
//                                             <div className="flex items-start justify-between">
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="font-medium text-sm">{app.fullName}</p>
//                                                     <p className="text-xs text-muted-foreground truncate">{app.email}</p>
//                                                     <p className="text-xs text-muted-foreground">{app.phoneNumber}</p>
//                                                 </div>
//                                                 <div className="ml-2">
//                                                     {getStatusBadge(app.status)}
//                                                 </div>
//                                             </div>
//                                             <div className="pt-2 border-t">
//                                                 <p className="text-sm font-medium line-clamp-2">{app.vehicleTitle}</p>
//                                                 <p className="text-xs text-muted-foreground mt-1">
//                                                     Price: {formatCurrency(app.vehiclePrice)}
//                                                 </p>
//                                             </div>
//                                             <div className="grid grid-cols-2 gap-2 text-xs">
//                                                 <div>
//                                                     <span className="text-muted-foreground">Loan Amount:</span>
//                                                     <p className="font-semibold">{formatCurrency(app.loanAmount)}</p>
//                                                 </div>
//                                                 <div>
//                                                     <span className="text-muted-foreground">Monthly:</span>
//                                                     <p className="font-semibold text-primary">{formatCurrency(app.monthlyPayment)}</p>
//                                                 </div>
//                                             </div>
//                                             <div className="text-xs text-muted-foreground">
//                                                 <p>{app.location.town}, {app.location.district}</p>
//                                                 <p>{new Date(app.submittedAt).toLocaleDateString()}</p>
//                                             </div>
//                                             <Button
//                                                 size="sm"
//                                                 variant="outline"
//                                                 className="w-full"
//                                                 onClick={() => {
//                                                     setSelectedApplication(app);
//                                                     setDetailsOpen(true);
//                                                 }}
//                                             >
//                                                 <Eye className="w-4 h-4 mr-1" />
//                                                 View Details
//                                             </Button>
//                                         </CardContent>
//                                     </Card>
//                                 ))}
//                             </div>

//                             {/* Desktop Table View */}
//                             <div className="hidden md:block overflow-x-auto">
//                                 <Table>
//                                     <TableHeader>
//                                         <TableRow>
//                                             <TableHead>Applicant</TableHead>
//                                             <TableHead>Vehicle</TableHead>
//                                             <TableHead>Location</TableHead>
//                                             <TableHead>Amount</TableHead>
//                                             <TableHead>Monthly</TableHead>
//                                             <TableHead>Status</TableHead>
//                                             <TableHead>Date</TableHead>
//                                             <TableHead>Actions</TableHead>
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         {pagination.paginatedData.map((app) => (
//                                         <TableRow key={app.id}>
//                                             <TableCell>
//                                                 <div>
//                                                     <p className="font-medium">{app.fullName}</p>
//                                                     <p className="text-sm text-muted-foreground">{app.email}</p>
//                                                     <p className="text-sm text-muted-foreground">{app.phoneNumber}</p>
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <p className="font-medium line-clamp-2">{app.vehicleTitle}</p>
//                                                 <p className="text-sm text-muted-foreground">
//                                                     {formatCurrency(app.vehiclePrice)}
//                                                 </p>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="text-sm">
//                                                     <p>{app.location.town}</p>
//                                                     <p className="text-muted-foreground">{app.location.district}</p>
//                                                     <p className="text-muted-foreground text-xs">{app.location.province}</p>
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>{formatCurrency(app.loanAmount)}</TableCell>
//                                             <TableCell className="font-semibold">
//                                                 {formatCurrency(app.monthlyPayment)}
//                                             </TableCell>
//                                             <TableCell>{getStatusBadge(app.status)}</TableCell>
//                                             <TableCell>
//                                                 {new Date(app.submittedAt).toLocaleDateString()}
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Button
//                                                     size="sm"
//                                                     variant="outline"
//                                                     onClick={() => {
//                                                         setSelectedApplication(app);
//                                                         setDetailsOpen(true);
//                                                     }}
//                                                 >
//                                                     <Eye className="w-4 h-4 mr-1" />
//                                                     View
//                                                 </Button>
//                                             </TableCell>
//                                         </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </div>
//                             {pagination.totalPages > 1 && (
//                                 <div className="mt-6">
//                                     <Pagination>
//                                         <PaginationContent>
//                                             <PaginationItem>
//                                                 <PaginationPrevious
//                                                     onClick={pagination.previousPage}
//                                                     className={!pagination.canGoPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                                                 />
//                                             </PaginationItem>
//                                             {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
//                                                 if (
//                                                     page === 1 ||
//                                                     page === pagination.totalPages ||
//                                                     (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
//                                                 ) {
//                                                     return (
//                                                         <PaginationItem key={page}>
//                                                             <PaginationLink
//                                                                 onClick={() => pagination.goToPage(page)}
//                                                                 isActive={pagination.currentPage === page}
//                                                                 className="cursor-pointer"
//                                                             >
//                                                                 {page}
//                                                             </PaginationLink>
//                                                         </PaginationItem>
//                                                     );
//                                                 } else if (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) {
//                                                     return (
//                                                         <PaginationItem key={page}>
//                                                             <PaginationEllipsis />
//                                                         </PaginationItem>
//                                                     );
//                                                 }
//                                                 return null;
//                                             })}
//                                             <PaginationItem>
//                                                 <PaginationNext
//                                                     onClick={pagination.nextPage}
//                                                     className={!pagination.canGoNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                                                 />
//                                             </PaginationItem>
//                                         </PaginationContent>
//                                     </Pagination>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </CardContent>
//             </Card>

//             {/* Details Dialog */}
//             <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
//                 <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
//                     <DialogHeader>
//                         <DialogTitle>Application Details</DialogTitle>
//                         <DialogDescription>
//                             Review and manage this lease application
//                         </DialogDescription>
//                     </DialogHeader>

//                     {selectedApplication && (
//                         <div className="space-y-6">
//                             {/* Status Actions */}
//                             <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
//                                 {selectedApplication.status !== "approved" && (
//                                     <Button
//                                         size="sm"
//                                         className="bg-green-600 hover:bg-green-700"
//                                         onClick={() => updateApplicationStatus(selectedApplication.id, "approved")}
//                                     >
//                                         <CheckCircle className="w-4 h-4 mr-1" />
//                                         Approve
//                                     </Button>
//                                 )}
//                                 {selectedApplication.status === "pending" && (
//                                     <Button
//                                         size="sm"
//                                         className="bg-blue-600 hover:bg-blue-700"
//                                         onClick={() => updateApplicationStatus(selectedApplication.id, "in-review")}
//                                     >
//                                         <Clock className="w-4 h-4 mr-1" />
//                                         Mark In Review
//                                     </Button>
//                                 )}
//                                 {selectedApplication.status !== "rejected" && (
//                                     <Button
//                                         size="sm"
//                                         variant="destructive"
//                                         onClick={() => updateApplicationStatus(selectedApplication.id, "rejected")}
//                                     >
//                                         <XCircle className="w-4 h-4 mr-1" />
//                                         Reject
//                                     </Button>
//                                 )}
//                                 <Button
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={() => downloadApplication(selectedApplication)}
//                                 >
//                                     <Download className="w-4 h-4 mr-1" />
//                                     Download
//                                 </Button>
//                             </div>

//                             {/* Personal Info */}
//                             <div>
//                                 <h3 className="font-semibold mb-3 text-sm md:text-base">Personal Information</h3>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
//                                     <div>
//                                         <span className="text-muted-foreground">Full Name:</span>
//                                         <p className="font-medium">{selectedApplication.fullName}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-muted-foreground">NIC:</span>
//                                         <p className="font-medium">{selectedApplication.nic}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-muted-foreground">Email:</span>
//                                         <p className="font-medium">{selectedApplication.email}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-muted-foreground">Phone:</span>
//                                         <p className="font-medium">{selectedApplication.phoneNumber}</p>
//                                     </div>
//                                     <div className="col-span-2">
//                                         <span className="text-muted-foreground">Address:</span>
//                                         <p className="font-medium">{selectedApplication.address}</p>
//                                     </div>
//                                     <div className="col-span-2">
//                                         <span className="text-muted-foreground">Location:</span>
//                                         <p className="font-medium">
//                                             {selectedApplication.location.town}, {selectedApplication.location.district},{" "}
//                                             {selectedApplication.location.province}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Employment Info */}
//                             <div>
//                                 <h3 className="font-semibold mb-3 text-sm md:text-base">Employment Information</h3>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
//                                     <div>
//                                         <span className="text-muted-foreground">Status:</span>
//                                         <p className="font-medium">{selectedApplication.employmentStatus}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-muted-foreground">Occupation:</span>
//                                         <p className="font-medium">{selectedApplication.occupation}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-muted-foreground">Employer:</span>
//                                         <p className="font-medium">{selectedApplication.employerName || "N/A"}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-muted-foreground">Duration:</span>
//                                         <p className="font-medium">{selectedApplication.employmentDuration}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-muted-foreground">Monthly Income:</span>
//                                         <p className="font-medium text-primary">
//                                             {formatCurrency(selectedApplication.monthlyIncome)}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Loan Details */}
//                             <div>
//                                 <h3 className="font-semibold mb-3 text-sm md:text-base">Loan Details</h3>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
//                                     <div>
//                                         <span className="text-muted-foreground">Vehicle Price:</span>
//                                         <p className="font-medium">{formatCurrency(selectedApplication.vehiclePrice)}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-muted-foreground">Down Payment:</span>
//                                         <p className="font-medium">{formatCurrency(selectedApplication.downPayment)}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-muted-foreground">Loan Amount:</span>
//                                         <p className="font-medium text-primary">
//                                             {formatCurrency(selectedApplication.loanAmount)}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <span className="text-muted-foreground">Duration:</span>
//                                         <p className="font-medium">{selectedApplication.loanDuration} months</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-muted-foreground">Interest Rate:</span>
//                                         <p className="font-medium">{selectedApplication.interestRate}%</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-muted-foreground">Monthly Payment:</span>
//                                         <p className="font-medium text-lg text-primary">
//                                             {formatCurrency(selectedApplication.monthlyPayment)}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Notes */}
//                             {selectedApplication.applicantNotes && (
//                                 <div>
//                                     <h3 className="font-semibold mb-3">Applicant Notes</h3>
//                                     <p className="text-sm bg-muted p-3 rounded">
//                                         {selectedApplication.applicantNotes}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// export default AdminLeaseApplications;
