"use client";

import { CyberneticBentoGrid } from "@/components/ui/cybernetic-bento-grid";
import Footer from "@/components/footer";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
export default function Home() {
    return (
        <div className="min-h-screen text-white">
            {/* Hero Section */}
            <HeroGeometric
                title1="Real-Time"
                title2="Remote Collaboration"
            />

            {/* Core Bento Grid */}
            <CyberneticBentoGrid />

            {/* Footer */}
            <Footer />
        </div>
    );
}
