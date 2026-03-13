"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Wallet, ShieldAlert, AlertCircle, ShieldCheck, ArrowRight, Loader2, Sparkles, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "../../../navigation";
import { useTranslations } from "next-intl";
import { saveEmailAnalysis, saveEmailLog } from "@/services/firebaseService";

export default function UPIAnalyzer() {
  const t = useTranslations("Analyzer");
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      }
    }
  }, [user, profile, authLoading, router]);

  const handleAnalyze = async () => {
    if (!inputValue) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("https://humanfirewall-backend.onrender.com/api/classify-upi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upi: inputValue }),
      });
      
      if (!response.ok) throw new Error("Backend connection failed");
      
      const data = await response.json();
      const analysisResult = {
        classification: data.safety.charAt(0).toUpperCase() + data.safety.slice(1),
        safety: data.safety,
        confidence: data.confidence, // UPI API returns 0-100 based on AnalyzerCards.tsx usage
        indicators: data.indicators,
        reason: data.reason,
        source: "upi"
      };

      // Save to Firebase
      if (user) {
        await saveEmailAnalysis(user.uid, analysisResult);
        
        if (profile?.role === "employee") {
          await saveEmailLog({
            employeeEmail: user.email,
            subject: "UPI Analysis",
            sender: "Direct Input",
            safety: data.safety,
            confidence: data.confidence,
            reason: data.reason
          });
        }
      }
      
      setResult(analysisResult);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Unable to connect to analysis engine. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase">
            <Sparkles className="w-3 h-3" />
            <span>{t("poweredBy")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {t("upi.title")}
          </h1>
          <p className="text-white/50 text-base md:text-lg">
            {t("upi.desc")}
          </p>
        </header>

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-white/5 space-y-6"
        >
          <div className="space-y-4">
             <label className="text-sm font-bold text-white/50 uppercase tracking-widest px-2">{t("inputSource")}</label>
             <input
               type="text"
               className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-primary/30 transition-all text-white/80 text-lg"
               placeholder={t("upi.placeholder")}
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
             />
          </div>

          {error && <p className="text-danger text-sm font-bold text-center">{error}</p>}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputValue}
            className="w-full py-5 bg-primary text-background font-bold rounded-[20px] hover:neon-glow-cyan transition-all disabled:opacity-50 flex items-center justify-center space-x-3 text-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>{t("processing")}</span>
              </>
            ) : (
              <>
                <Zap className="w-6 h-6" />
                <span>{t("upi.button")}</span>
              </>
            )}
          </button>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-6 md:p-8 rounded-[32px] md:rounded-[40px] border relative overflow-hidden ${
                result.safety === "safe" 
                ? "bg-secondary/5 border-secondary/20" 
                : result.safety === "suspicious" 
                ? "bg-warning/5 border-warning/20" 
                : "bg-danger/5 border-danger/20"
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                   <div className={`p-5 rounded-3xl ${
                     result.safety === "safe" ? "bg-secondary/20 text-secondary" : 
                     result.safety === "suspicious" ? "bg-warning/20 text-warning" : "bg-danger/20 text-danger"
                   }`}>
                      {result.safety === "safe" ? <ShieldCheck className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
                   </div>
                   <div className="space-y-1 text-center md:text-left">
                      <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-widest ${
                        result.safety === "safe" ? "text-secondary" : 
                        result.safety === "suspicious" ? "text-warning" : "text-danger"
                      }`}>
                         {result.safety === "safe" ? t("verifiedSafe") : result.safety === "suspicious" ? t("suspiciousActivity") : t("threatDetected")}
                      </h3>
                      <p className="text-white/50 font-medium text-sm md:text-base">Confidence Score: <span className="text-white">{result.confidence}%</span></p>
                      {result.reason && (
                        <p className="text-sm text-white/60 leading-relaxed italic border-l-2 border-white/10 pl-4 py-1 mt-2">
                          &quot;{result.reason}&quot;
                        </p>
                      )}
                   </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-3 max-w-sm">
                   {result.indicators && result.indicators.length > 0 ? result.indicators.map((indicator: string) => (
                      <span key={indicator} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold flex items-center space-x-2 text-white/70">
                         <AlertCircle className="w-3 h-3 text-danger" />
                         <span>{indicator}</span>
                      </span>
                   )) : (
                      <span className="px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-xs font-bold text-secondary flex items-center space-x-2">
                         <ShieldCheck className="w-3 h-3" />
                         <span>{t("noIndicators")}</span>
                      </span>
                   )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
