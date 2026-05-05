import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, Clock, DollarSign } from "lucide-react";
import { defaultLeaseSettings } from "@/lib/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

interface LeaseCalculatorProps {
    vehiclePrice: number;
    onCalculate?: (result: {
        downPayment: number;
        loanAmount: number;
        monthlyPayment: number;
        totalInterest: number;
        totalPayment: number;
    }) => void;
}

const LeaseCalculator = ({ vehiclePrice, onCalculate }: LeaseCalculatorProps) => {
    const { t } = useLanguage();
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [loanDuration, setLoanDuration] = useState(48); // months
    const [interestRate, setInterestRate] = useState(defaultLeaseSettings.defaultInterestRate);
    const [leaseSettings, setLeaseSettings] = useState(defaultLeaseSettings);

    useEffect(() => {
        const storedSettings = localStorage.getItem("leaseSettings");
        if (storedSettings) {
            const parsed = JSON.parse(storedSettings);
            setLeaseSettings(parsed);
            setInterestRate(parsed.defaultInterestRate);
        }
    }, []);

    // Calculated values
    const [downPayment, setDownPayment] = useState(0);
    const [loanAmount, setLoanAmount] = useState(0);
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);

    useEffect(() => {
        // Calculate loan details
        const dp = (vehiclePrice * downPaymentPercent) / 100;
        const loan = vehiclePrice - dp;

        // Monthly interest rate
        const monthlyRate = interestRate / 100 / 12;

        // Calculate monthly payment using amortization formula
        const mp = monthlyRate === 0
            ? loan / loanDuration
            : (loan * monthlyRate * Math.pow(1 + monthlyRate, loanDuration)) /
            (Math.pow(1 + monthlyRate, loanDuration) - 1);

        const total = mp * loanDuration;
        const interest = total - loan;

        setDownPayment(dp);
        setLoanAmount(loan);
        setMonthlyPayment(mp);
        setTotalInterest(interest);
        setTotalPayment(total + dp);

        // Callback with results
        if (onCalculate) {
            onCalculate({
                downPayment: dp,
                loanAmount: loan,
                monthlyPayment: mp,
                totalInterest: interest,
                totalPayment: total + dp,
            });
        }
    }, [vehiclePrice, downPaymentPercent, loanDuration, interestRate, onCalculate]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const durationOptions = [
        { value: 12, label: `1 ${t.lease_year}` },
        { value: 24, label: `2 ${t.lease_years}` },
        { value: 36, label: `3 ${t.lease_years}` },
        { value: 48, label: `4 ${t.lease_years}` },
        { value: 60, label: `5 ${t.lease_years}` },
        { value: 72, label: `6 ${t.lease_years}` },
        { value: 84, label: `7 ${t.lease_years}` },
    ];

    return (
        <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    {t.lease_calculatorTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {/* Vehicle Price */}
                <div className="p-4 bg-muted rounded-lg">
                    <Label className="text-sm text-muted-foreground">{t.lease_vehiclePrice}</Label>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(vehiclePrice)}</p>
                </div>

                {/* Down Payment */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label>{t.lease_downPayment}</Label>
                        <span className="text-sm font-semibold">{downPaymentPercent}%</span>
                    </div>
                    <Slider
                        value={[downPaymentPercent]}
                        onValueChange={(value) => setDownPaymentPercent(value[0])}
                        min={leaseSettings.minDownPaymentPercentage}
                        max={50}
                        step={5}
                        className="py-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{leaseSettings.minDownPaymentPercentage}%</span>
                        <span className="font-semibold text-foreground">{formatCurrency(downPayment)}</span>
                        <span>50%</span>
                    </div>
                </div>

                {/* Loan Duration */}
                <div className="space-y-2">
                    <Label>{t.lease_loanDuration}</Label>
                    <Select
                        value={loanDuration.toString()}
                        onValueChange={(val) => setLoanDuration(parseInt(val))}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {durationOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value.toString()}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label>{t.lease_interestRate}</Label>
                        <span className="text-sm font-semibold">{interestRate}%</span>
                    </div>
                    <Input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                        min={leaseSettings.minInterestRate}
                        max={leaseSettings.maxInterestRate}
                        step={0.5}
                    />
                    <p className="text-xs text-muted-foreground">
                        {t.lease_interestRange}: {leaseSettings.minInterestRate}% - {leaseSettings.maxInterestRate}%
                    </p>
                </div>

                {/* Results */}
                <div className="space-y-3 pt-4 border-t-2 border-primary/20">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="font-medium">{t.lease_monthlyPayment}</span>
                        </div>
                        <span className="text-xl font-bold text-primary">
                            {formatCurrency(monthlyPayment)}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                                <TrendingUp className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{t.lease_loanAmount}</span>
                            </div>
                            <p className="font-semibold">{formatCurrency(loanAmount)}</p>
                        </div>

                        <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{t.lease_durationLabel}</span>
                            </div>
                            <p className="font-semibold">{loanDuration} {t.lease_monthsLabel}</p>
                        </div>

                        <div className="p-3 bg-muted/50 rounded-lg">
                            <span className="text-xs text-muted-foreground block mb-1">{t.lease_totalInterest}</span>
                            <p className="font-semibold">{formatCurrency(totalInterest)}</p>
                        </div>

                        <div className="p-3 bg-muted/50 rounded-lg">
                            <span className="text-xs text-muted-foreground block mb-1">{t.lease_totalPayment}</span>
                            <p className="font-semibold">{formatCurrency(totalPayment)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LeaseCalculator;
