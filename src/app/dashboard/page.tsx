"use client";

import { Suspense } from "react";
import DashboardPage from "@/pages/Dashboard";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <DashboardPage />
        </Suspense>
    );
}
