"use client";

import { Suspense } from "react";
import ListingDetailPage from "@/pages/ListingDetail";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ListingDetailPage />
        </Suspense>
    );
}
