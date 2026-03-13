"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Inbox, Mail, ShieldCheck, AlertTriangle, AlertCircle, ShieldAlert, Star, RefreshCw, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Email {
  id: string;
  messageId?: string;
  sender: string;
  subject: string;
  snippet: string;
  body?: string;
  date: string;
  classification: "Safe" | "Suspicious" | "Dangerous";
  confidence: string;
  reason?: string;
}

export default function InboxScanner() {
  const { user } = useAuth();
  const [inbox, setInbox] = useState<Email[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const fetchEmails = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/gmail?uid=${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setInbox(data);
        setIsConnected(true);
      } else if (response.status === 401) {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEmails();
    }
  }, [user]);

  const handleConnectGmail = () => {
    if (!user) return;
    window.location.href = `/api/auth/google?uid=${user.uid}`;
  };

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-12 h-12 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 md:space-y-12 max-w-3xl mx-auto px-4 sm:px-6">
        <header className="flex flex-col items-center justify-center space-y-6 text-center w-full py-4">
          <div className="space-y-4 flex flex-col items-center w-full">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(0,255,255,0.1)] shrink-0"
             >
                <Inbox className="w-8 h-8 md:w-10 md:h-10" />
             </motion.div>
             <div className="space-y-2 w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight break-words">
                   Inbox <span className="text-primary">Scanner</span>
                </h1>
                <p className="text-white/50 text-sm md:text-lg max-w-lg mx-auto">Integrated real-time mailbox threat monitoring with AI-powered analysis.</p>
             </div>
          </div>
          <div className="flex items-center justify-center w-full max-w-sm mx-auto">
            {!isConnected ? (
              <button 
                 onClick={handleConnectGmail}
                 className="w-full px-6 py-3.5 bg-primary/20 border border-primary/30 text-primary rounded-2xl flex items-center justify-center space-x-2 hover:bg-primary/30 transition-all font-bold shadow-[0_0_20px_rgba(0,255,255,0.1)] text-sm md:text-base"
              >
                 <Lock className="w-5 h-5" />
                 <span>Connect Gmail</span>
              </button>
            ) : (
              <button 
                 onClick={fetchEmails}
                 className="w-full px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center space-x-2 hover:bg-white/10 hover:text-primary transition-all font-bold text-sm md:text-base"
              >
                 <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
                 <span>Sync Gmail</span>
              </button>
            )}
          </div>
        </header>

        {!isConnected ? (
          <div className="glass rounded-[32px] md:rounded-[40px] border-white/5 p-8 md:p-12 text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto border border-white/10">
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-white/20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold">Gmail Not Connected</h2>
              <p className="text-white/50 text-sm md:text-base max-w-md mx-auto">Connect your Gmail account to start scanning your inbox for phishing threats and malicious links in real-time.</p>
            </div>
            <button 
              onClick={handleConnectGmail}
              className="w-full md:w-auto px-8 py-4 bg-primary text-background rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,255,255,0.3)] text-sm md:text-base"
            >
              Authorize Secure Access
            </button>
          </div>
        ) : (
          <>
            <div className="glass rounded-[32px] md:rounded-[40px] border-white/5 overflow-hidden shadow-2xl">
              <div className="p-5 md:p-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between bg-white/[0.02] backdrop-blur-3xl gap-4">
                <div className="relative group w-full md:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 text-sm transition-all w-full"
                  />
                </div>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/40 text-[10px] md:text-xs font-bold tracking-widest uppercase shrink-0">
                  <span>{inbox.length} Messages Analyzed</span>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {inbox.length === 0 ? (
                  <div className="p-12 text-center text-white/30 font-bold">No messages found in your inbox.</div>
                ) : (
                  inbox.map((email, index) => (
                    <motion.div
                      key={email.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => setSelectedEmail(email)}
                      className="flex flex-col md:flex-row items-start md:items-center p-5 md:p-6 hover:bg-white/[0.03] transition-all group cursor-pointer relative gap-4 border-b border-white/5 last:border-0 w-full overflow-hidden"
                    >
                      <div className="flex items-center space-x-4 w-full md:w-auto shrink-0">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center p-0.5 border border-white/10 bg-gradient-to-br shrink-0 ${
                           email.classification === "Safe" ? "from-secondary/30 to-background/30" : 
                           email.classification === "Suspicious" ? "from-warning/30 to-background/30" : "from-danger/30 to-background/30"
                        }`}>
                           <div className="w-full h-full bg-background rounded-[10px] md:rounded-[14px] flex items-center justify-center">
                              <Mail className={`w-5 h-5 md:w-6 md:h-6 ${
                                 email.classification === "Safe" ? "text-secondary" : 
                                 email.classification === "Suspicious" ? "text-warning" : "text-danger"
                              }`} />
                           </div>
                        </div>
                        <div className="min-w-0 flex-1">
                           <h4 className="text-sm font-bold truncate text-white">{(email.sender.split('<')[0] || "").trim()}</h4>
                           <p className="text-[10px] text-white/30 uppercase font-black tracking-widest truncate">{email.date}</p>
                        </div>
                        <div className="md:hidden">
                           <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                              email.classification === "Safe" ? "bg-secondary/10 border-secondary/20 text-secondary" : 
                              email.classification === "Suspicious" ? "bg-warning/10 border-warning/20 text-warning" : "bg-danger/10 border-danger/20 text-danger"
                           }`}>
                              {email.classification}
                           </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 w-full md:grid md:grid-cols-4 md:items-center md:gap-8">
                        <div className="col-span-1 md:col-span-3 min-w-0 space-y-1 w-full">
                           <h4 className="text-sm md:text-base font-bold md:font-medium truncate text-primary group-hover:text-primary/80 transition-colors">{email.subject}</h4>
                           <p className="text-xs text-white/40 line-clamp-2 md:truncate w-full">{email.snippet}</p>
                        </div>

                        <div className="hidden md:flex col-span-1 flex-col items-end justify-center space-y-1">
                           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              email.classification === "Safe" ? "bg-secondary/10 border-secondary/20 text-secondary" : 
                              email.classification === "Suspicious" ? "bg-warning/10 border-warning/20 text-warning" : "bg-danger/10 border-danger/20 text-danger"
                           }`}>
                              {email.classification}
                           </div>
                           <span className="text-[10px] text-white/20 font-bold uppercase tracking-tighter">Conf: {email.confidence}</span>
                        </div>
                      </div>

                      <div className="md:hidden flex items-center justify-between w-full pt-2 border-t border-white/5 mt-1">
                        <span className="text-[9px] text-white/20 font-bold uppercase tracking-tighter">Confidence: {email.confidence}</span>
                        <div className="flex items-center space-x-3">
                           <ShieldAlert className="w-4 h-4 text-white/20" />
                        </div>
                      </div>

                      <div className="hidden md:flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                         <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-primary transition-all"><ShieldAlert className="w-5 h-5" /></button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
               <div className="glass p-6 md:p-8 rounded-[24px] md:rounded-[40px] border-white/5 flex items-center space-x-5 md:space-x-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl md:text-2xl border border-primary/20 shadow-[0_0_20px_rgba(0,255,255,0.1)] shrink-0">{inbox.length}</div>
                  <div className="space-y-0.5 md:space-y-1 min-w-0">
                     <h4 className="font-bold text-sm md:text-lg truncate">Total Mails</h4>
                     <p className="text-white/50 text-[10px] md:text-sm truncate">Gmail API</p>
                  </div>
               </div>
               <div className="glass p-6 md:p-8 rounded-[24px] md:rounded-[40px] border-white/5 flex items-center space-x-5 md:space-x-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-danger/10 flex items-center justify-center text-danger font-black text-xl md:text-2xl border border-danger/20 shadow-[0_0_20px_rgba(239,68,68,0.1)] shrink-0">
                    {inbox.filter(e => e.classification === 'Dangerous').length}
                  </div>
                  <div className="space-y-0.5 md:space-y-1 min-w-0">
                     <h4 className="font-bold text-sm md:text-lg text-danger truncate">Threats</h4>
                     <p className="text-white/50 text-[10px] md:text-sm truncate">Phishing risks</p>
                  </div>
               </div>
               <div className="glass p-6 md:p-8 rounded-[24px] md:rounded-[40px] border-white/5 flex items-center space-x-5 md:space-x-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary font-black text-xl md:text-2xl border border-secondary/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] shrink-0">
                    {inbox.filter(e => e.classification === 'Safe').length}
                  </div>
                  <div className="space-y-0.5 md:space-y-1 min-w-0">
                     <h4 className="font-bold text-sm md:text-lg text-secondary truncate">Verified Safe</h4>
                     <p className="text-white/50 text-[10px] md:text-sm truncate">Low risk</p>
                  </div>
               </div>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedEmail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-3xl glass rounded-[32px] md:rounded-[40px] border-white/10 overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
            >
              <div className="p-6 md:p-8 border-b border-white/5 flex items-start justify-between bg-white/5">
                <div className="space-y-4 flex-1 min-w-0 pr-4">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <div className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border ${
                      selectedEmail.classification === "Safe" ? "bg-secondary/10 border-secondary/20 text-secondary" : 
                      selectedEmail.classification === "Suspicious" ? "bg-warning/10 border-warning/20 text-warning" : "bg-danger/10 border-danger/20 text-danger"
                    }`}>
                      {selectedEmail.classification}
                    </div>
                    <span className="text-[8px] md:text-[10px] text-white/30 font-bold uppercase tracking-widest">Conf: {selectedEmail.confidence}</span>
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold text-white leading-tight break-words">{selectedEmail.subject}</h2>
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="hidden xs:flex w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 items-center justify-center border border-white/10 shrink-0">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-white/40" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-none">{selectedEmail.sender}</p>
                      <p className="text-[8px] md:text-[10px] text-white/30 uppercase font-black tracking-widest">{selectedEmail.date}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEmail(null)}
                  className="p-2 md:p-3 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all shrink-0"
                >
                  <RefreshCw className="w-5 h-5 md:w-6 md:h-6 rotate-45" />
                </button>
              </div>

              {/* AI Explanation Section */}
              <div className={`px-6 md:px-8 py-3 md:py-4 border-b border-white/5 flex items-center space-x-3 md:space-x-4 ${
                selectedEmail.classification === "Safe" ? "bg-secondary/5" : 
                selectedEmail.classification === "Suspicious" ? "bg-warning/5" : "bg-danger/5"
              }`}>
                <ShieldCheck className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 ${
                  selectedEmail.classification === "Safe" ? "text-secondary" : 
                  selectedEmail.classification === "Suspicious" ? "text-warning" : "text-danger"
                }`} />
                <p className="text-xs md:text-sm font-medium text-white/70 italic line-clamp-2 md:line-clamp-none">
                  <span className="font-bold text-white not-italic mr-2">AI Analysis:</span>
                  {selectedEmail.reason || "Our hybrid detection system has analyzed this email's patterns and indicators."}
                </p>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto text-white/80 leading-relaxed whitespace-pre-wrap font-mono text-xs md:text-sm flex-1">
                {selectedEmail.body || selectedEmail.snippet}
              </div>
              <div className="p-6 md:p-8 border-t border-white/5 bg-white/5 flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
                 <button 
                   onClick={() => setSelectedEmail(null)}
                   className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm"
                 >
                   Close
                 </button>
                 {selectedEmail.classification !== "Safe" && (
                   <button 
                     onClick={() => window.open("https://cybercrime.gov.in/Webform/Accept.aspx", "_blank")}
                     className="w-full sm:w-auto px-6 py-3 bg-danger text-white rounded-2xl hover:scale-105 transition-all font-bold shadow-[0_0_20px_rgba(239,68,68,0.2)] text-sm"
                   >
                     Report Threat
                   </button>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
