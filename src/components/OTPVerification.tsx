import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { sendOTP, verifyOTP, getOTPRemainingTime, clearOTP } from "@/lib/otp";
import { Loader2 } from "lucide-react";

interface OTPVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  phoneNumber: string;
}

const OTPVerification = ({
  isOpen,
  onClose,
  onVerified,
  phoneNumber,
}: OTPVerificationProps) => {
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Format phone number for display
  const formatPhoneNumber = (phone: string): string => {
    if (phone.length === 10 && phone.startsWith("0")) {
      return `+94 ${phone.slice(1, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
    }
    return phone;
  };

  // Send OTP
  const handleSendOTP = async () => {
    setIsSending(true);
    try {
      const result = await sendOTP(phoneNumber);
      if (result.success) {
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${formatPhoneNumber(phoneNumber)}`,
        });

        // In development, show the OTP in a toast
        if (process.env.NODE_ENV === 'development' && (result as any).devOTP) {
          setTimeout(() => {
            toast({
              title: "Development Mode - OTP",
              description: `Your OTP is: ${(result as any).devOTP}`,
              variant: "default",
            });
          }, 500);
        }

        setOtp("");
        setRemainingTime(300); // 5 minutes
        setCanResend(false);
      } else {
        toast({
          title: "Failed to send OTP",
          description: result.error || "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = verifyOTP(phoneNumber, otp);
      if (result.isValid) {
        toast({
          title: "Phone Verified",
          description: "Your mobile number has been verified successfully",
        });
        onVerified();
        onClose();
        setOtp("");
      } else {
        toast({
          title: "Verification Failed",
          description: result.error || "Invalid OTP. Please try again.",
          variant: "destructive",
        });
        setOtp("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!isOpen) {
      setOtp("");
      setRemainingTime(0);
      setCanResend(false);
      return;
    }

    // Send OTP when dialog opens
    handleSendOTP();

    const interval = setInterval(() => {
      const remaining = getOTPRemainingTime(phoneNumber);
      setRemainingTime(remaining);
      setCanResend(remaining === 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, phoneNumber]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Mobile Number</DialogTitle>
          <DialogDescription>
            We've sent a 6-digit verification code to{" "}
            <span className="font-semibold">{formatPhoneNumber(phoneNumber)}</span>
            . Please enter it below to verify your number.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter Verification Code</Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isLoading || isSending}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          {remainingTime > 0 && (
            <p className="text-sm text-center text-muted-foreground">
              Code expires in {formatTime(remainingTime)}
            </p>
          )}

          {canResend && (
            <p className="text-sm text-center text-muted-foreground">
              Code expired. Please request a new one.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || isLoading || isSending}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleSendOTP}
              disabled={isSending || (!canResend && remainingTime > 0)}
              className="w-full"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground text-center">
                Development Mode: Check the console or toast notification for the OTP code
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerification;
