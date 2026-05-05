import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, Clock, TrendingUp } from "lucide-react";
import { companyRating } from "@/lib/mockData";

const LeaseRating = () => {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : index < rating
                            ? "fill-yellow-400/50 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                    }`}
            />
        ));
    };

    return (
        <Card className="border-2 border-border">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">TradeHub Leasing Rating</h3>
                    <div className="flex items-center gap-1">
                        {renderStars(companyRating.overallRating)}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <div className="flex justify-center mb-2">
                            <Star className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-primary">{companyRating.overallRating}</p>
                        <p className="text-xs text-muted-foreground">Overall Rating</p>
                    </div>

                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-center mb-2">
                            <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold">{companyRating.totalReviews.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Reviews</p>
                    </div>

                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-center mb-2">
                            <TrendingUp className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold">{companyRating.successfulLeases.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Successful Leases</p>
                    </div>

                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-center mb-2">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-bold">{companyRating.averageApprovalTime}</p>
                        <p className="text-xs text-muted-foreground">Approval Time</p>
                    </div>
                </div>

                {/* Interest Rate Range */}
                <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-lg mb-6">
                    <h4 className="font-semibold mb-2">Interest Rate Range</h4>
                    <p className="text-2xl font-bold text-primary">
                        {companyRating.interestRateRange.min}% - {companyRating.interestRateRange.max}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Competitive rates tailored to your credit profile
                    </p>
                </div>

                {/* Testimonials */}
                {companyRating.testimonials.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-3">Customer Testimonials</h4>
                        <div className="space-y-3">
                            {companyRating.testimonials.slice(0, 2).map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="p-4 bg-muted/30 rounded-lg border border-border"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">{testimonial.customerName}</span>
                                        <div className="flex items-center gap-1">
                                            {renderStars(testimonial.rating)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">"{testimonial.comment}"</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{testimonial.vehicleType}</span>
                                        <span>{new Date(testimonial.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LeaseRating;
