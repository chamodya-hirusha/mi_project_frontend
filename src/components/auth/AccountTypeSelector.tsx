"use client";

import React, { useState } from "react";
import { User, Building2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface AccountTypeSelectorProps {
  onSelect: (type: "Personal" | "business") => void;
}

const AccountTypeSelector = ({ onSelect }: AccountTypeSelectorProps) => {
  const [selected, setSelected] = useState<"Personal" | "business" | null>(null);

  return (
    <Card className="w-full max-w-md mx-auto border-none shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-500">
      <CardHeader className="p-6 sm:p-8 text-center bg-muted/20 border-b">
        <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
          Create Account
        </CardTitle>
        <CardDescription className="text-sm font-medium text-slate-500">
          Sign up to start posting ads
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <RadioGroup
          value={selected || ""}
          onValueChange={(v) => setSelected(v as "Personal" | "business")}
          className="grid gap-4"
        >
          <Label
            htmlFor="Personal"
            className={cn(
              "flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer group",
              selected === "Personal"
                ? "border-primary bg-primary/5 shadow-md"
                : "border-muted bg-white hover:border-primary/30"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
                  selected === "Personal"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                )}
              >
                <User className="h-6 w-6" />
              </div>
              <div>
                <div className="font-black text-lg text-slate-900">Personal Profile</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Individual User
                </div>
              </div>
            </div>
            <RadioGroupItem value="Personal" id="Personal" className="sr-only" />
            <div
              className={cn(
                "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                selected === "Personal" ? "border-primary bg-primary" : "border-muted"
              )}
            >
              {selected === "Personal" && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
            </div>
          </Label>

          <Label
            htmlFor="business"
            className={cn(
              "flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer group",
              selected === "business"
                ? "border-primary bg-primary/5 shadow-md"
                : "border-muted bg-white hover:border-primary/30"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
                  selected === "business"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                )}
              >
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="font-black text-lg text-slate-900">Business Profile</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Dealer / Company
                </div>
              </div>
            </div>
            <RadioGroupItem value="business" id="business" className="sr-only" />
            <div
              className={cn(
                "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                selected === "business" ? "border-primary bg-primary" : "border-muted"
              )}
            >
              {selected === "business" && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
            </div>
          </Label>
        </RadioGroup>

        {selected && (
          <div className="mt-8 p-4 bg-muted/30 rounded-2xl border border-muted-foreground/10 min-h-[80px] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
            <p className="text-sm font-bold text-muted-foreground/80 leading-relaxed italic">
              {selected === "Personal"
                ? "Personal account - browse and interact freely."
                : "Business account - post ads, manage listings, and grow your business."}
            </p>
          </div>
        )}

        <Button
          className={cn(
            "w-full h-12 mt-8 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg",
            selected
              ? "bg-primary hover:bg-primary/90 shadow-primary/20"
              : "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
          )}
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
        >
          Continue
          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountTypeSelector;
