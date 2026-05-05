"use client";

import { Suspense } from "react";
import EditProfile from "@/pages/EditProfile";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <EditProfile />
        </Suspense>
    );
}
