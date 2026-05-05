"use client";

import { Suspense } from "react";
import PostAdPage from "@/pages/PostAd";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostAdPage />
        </Suspense>
    );
}
