import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck, Bug, CheckCircle } from "lucide-react";

import SEO from "@/components/SEO";
import ParticleGrid from "@/components/ParticleGrid";
import LightPillar from "@/components/LightPillar";
import BorderGlow from "@/components/BorderGlow";
import GradientText from "@/components/GradientText";
import ShinyText from "@/components/ShinyText";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
      <SEO title="Milton Klun | QA Automation Engineer" />

      <ParticleGrid />

      <div className="absolute inset-0 z-[2] pointer-events-none" style={{ transform: 'translateY(8%)' }}>
        <LightPillar
          topColor="#ff0000"
          bottomColor="#00ff00"
          intensity={1}
          rotationSpeed={0.3}
          glowAmount={0.002}
          pillarWidth={3}
          pillarHeight={0.4}
          noiseIntensity={0}
          pillarRotation={89}
          interactive={false}
          mixBlendMode="normal"
          quality="high"
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-7 sm:mb-14 lg:mb-16"
        >
          <span className="block"><ShinyText text="Welcome to my" color="#d4d4d8" shineColor="#ffffff" speed={3} delay={1.5} /></span>
          <GradientText colors={["#3b82f6", "#a855f6", "#6366f1"]} animationSpeed={8} className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold">QA Portfolio</GradientText>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full max-w-xs mx-auto md:max-w-none"
        >
          <BorderGlow
            borderRadius={16}
            glowRadius={30}
            glowColor="0 80 60"
            colors={['#ef4444', '#f97316', '#dc2626']}
            className="group h-full cursor-default"
          >
            <div className="relative p-4 sm:p-8 flex flex-col h-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-danger/10 flex items-center justify-center mb-2 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Bug className="w-6 h-6 sm:w-8 sm:h-8 text-danger" />
              </div>

              <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-danger" />
                <h2 className="text-xl sm:text-2xl font-bold"><GradientText colors={["#ef4444", "#f97316", "#ef4444"]} animationSpeed={6}>Untested Version</GradientText></h2>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-8 flex-grow">
                Experience a product without QA intervention, when potential bugs slip through to production.
              </p>

              <Link to="/untested" className="w-full block">
                <Button variant="dangerOutline" size="lg" className="w-full text-sm sm:text-lg h-10 sm:h-12">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Launch Untested
                </Button>
              </Link>
            </div>
          </BorderGlow>

          <BorderGlow
            borderRadius={16}
            glowRadius={30}
            glowColor="142 76 50"
            colors={['#22c55e', '#10b981', '#34d399']}
            className="group h-full cursor-default"
          >
            <div className="relative p-4 sm:p-8 flex flex-col h-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-2 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
              </div>

              <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                <h2 className="text-xl sm:text-2xl font-bold"><GradientText colors={["#22c55e", "#34d399", "#22c55e"]} animationSpeed={6}>Verified Version</GradientText></h2>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-8 flex-grow">
                See the stable product after a quality assurance process.
                Every feature tested and verified.
              </p>

              <Link to="/tested" className="w-full block">
                <Button variant="successOutline" size="lg" className="w-full text-sm sm:text-lg h-10 sm:h-12">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Launch Verified
                </Button>
              </Link>
            </div>
          </BorderGlow>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
