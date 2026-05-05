"use client";

import { Suspense } from "react";
import AuthPage from "@/pages/Auth";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthPage />
        </Suspense>
    );
}
