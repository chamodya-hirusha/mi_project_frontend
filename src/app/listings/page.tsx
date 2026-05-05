"use client";

import { Suspense } from "react";
import ListingsPage from "@/pages/Listings";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading listings...</div>}>
            <ListingsPage />
        </Suspense>
    );
}
