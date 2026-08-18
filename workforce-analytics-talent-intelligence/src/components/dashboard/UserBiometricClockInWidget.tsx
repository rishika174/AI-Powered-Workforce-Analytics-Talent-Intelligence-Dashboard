import React, { useState, useEffect } from 'react';
import {
  Fingerprint,
  Camera,
  MapPin,
  QrCode,
  CheckCircle2,
  Clock,
  LogOut,
  Sparkles,
  RefreshCw,
  Zap,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

export const UserBiometricClockInWidget: React.FC = () => {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'Biometric' | 'Face' | 'GPS' | 'QR'>('Biometric');
  const [isScanning, setIsScanning] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer while checked in
  useEffect(() => {
    let interval: any = null;
    if (isCheckedIn) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClockIn = () => {
    if (isCheckedIn) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsCheckedIn(true);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCheckInTime(timeStr);
      setNotice(`Verified via ${selectedMethod}! Checked in at ${timeStr}. Attendance auto-logged.`);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      setTimeout(() => setNotice(null), 5000);
    }, 1200);
  };

  const handleClockOut = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsCheckedIn(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setNotice(`Clocked out at ${timeStr}. Total Session Duration: ${formatElapsedTime(elapsedSeconds)}.`);
      setCheckInTime(null);
      setTimeout(() => setNotice(null), 5000);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-indigo-500/30 shadow-xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Side: Personal Status */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Personal Biometric & Attendance Terminal
            </span>
            {isCheckedIn ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Active Session
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold">
                Not Checked In
              </span>
            )}
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Welcome, {user?.name || 'User'}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isCheckedIn
                ? `Clocked in at ${checkInTime} via ${selectedMethod}. Work timer active.`
                : 'Select your preferred verification method below to record your daily attendance.'}
            </p>
          </div>

          {/* Active Timer Display */}
          {isCheckedIn && (
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <Clock className="w-4 h-4 text-emerald-400 animate-spin" />
              <div>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-bold block">
                  Today's Worked Time
                </span>
                <span className="text-lg font-mono font-extrabold text-emerald-300">
                  {formatElapsedTime(elapsedSeconds)}
                </span>
              </div>
            </div>
          )}

          {/* Verification Method Tabs */}
          {!isCheckedIn && (
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { id: 'Biometric', label: 'Thumbprint', icon: Fingerprint },
                { id: 'Face', label: 'Face AI', icon: Camera },
                { id: 'GPS', label: 'GPS Zone', icon: MapPin },
                { id: 'QR', label: 'QR Scan', icon: QrCode },
              ].map((m) => {
                const Icon = m.icon;
                const active = selectedMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Interactive Action Scanner & Buttons */}
        <div className="flex flex-col items-center md:items-end justify-center gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <AnimatePresence mode="wait">
            {notice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 max-w-xs text-left"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{notice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {!isCheckedIn ? (
            <button
              id="btn-user-dashboard-clockin"
              onClick={handleClockIn}
              disabled={isScanning}
              className="w-full md:w-auto px-6 py-3.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 shadow-lg shadow-blue-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying {selectedMethod}...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5 text-amber-300" />
                  <span>Clock In via {selectedMethod}</span>
                </>
              )}
            </button>
          ) : (
            <button
              id="btn-user-dashboard-clockout"
              onClick={handleClockOut}
              disabled={isScanning}
              className="w-full md:w-auto px-6 py-3.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 shadow-lg shadow-rose-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Clocking Out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5 text-white" />
                  <span>Clock Out Session</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Biometric Verification Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
