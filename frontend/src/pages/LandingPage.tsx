import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Sparkles,
  PhoneCall,
  Lock,
  ArrowRight,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  FileText,
  Smartphone,
  CreditCard,
} from 'lucide-react';
import IndiaCrimeMap from '../components/IndiaCrimeMap';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      {/* Hero Section with Cybersecurity Background */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center px-4 py-20 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(5, 13, 26, 0.85), rgba(11, 27, 54, 0.92), rgba(2, 8, 19, 0.98)), url('/cyber-bg.svg')`,
        }}
      >
        {/* Glowing background accent circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Protect Yourself From <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              Cyber Fraud & Phishing
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Report cybercrimes securely, scan suspicious payment links using AI Threat Intelligence, and access immediate guidance to freeze fraudulent transactions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <ShieldAlert size={20} />
              <span>Report Cyber Incident</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-cyan-300 px-8 py-3.5 rounded-xl text-base font-bold flex items-center justify-center gap-2 backdrop-blur-md shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles size={20} className="text-cyan-400" />
              <span>AI Link Threat Scanner</span>
            </Link>
          </div>

          {/* Emergency Helpline Highlight */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-lg">
              <PhoneCall className="text-red-400" size={16} />
              <span>National Helpline: <strong className="text-white text-sm">1930</strong> (Toll-Free)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-lg">
              <Lock className="text-emerald-400" size={16} />
              <span>100% Encrypted & Confidential</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-lg">
              <UserCheck className="text-blue-400" size={16} />
              <span>Certified Cyber Forensics Network</span>
            </div>
          </div>
        </div>
      </section>

      {/* National Crime & IPC Statistics Map Visualization */}
      <IndiaCrimeMap />

      {/* Feature Pillars Section */}
      <section className="py-20 px-6 bg-slate-900/80 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              End-to-End Cyber Crime Response
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Equipping citizens and law enforcement with modern tools to identify, report, and neutralize cyber attacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition group">
              <div className="p-3.5 bg-blue-600/10 text-blue-400 rounded-xl w-fit mb-5 group-hover:bg-blue-600 group-hover:text-white transition">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI-Driven Link & SMS Inspector</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Paste suspicious URLs, fake bank reward portals, or APK download links. Our AI threat model analyzes indicators of compromise and issues an instant safety rating.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-red-500/50 transition group">
              <div className="p-3.5 bg-red-600/10 text-red-400 rounded-xl w-fit mb-5 group-hover:bg-red-600 group-hover:text-white transition">
                <ShieldAlert size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Rapid Incident Filing & Triage</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Report financial fraud, identity theft, or harassment. Automated AI triage extracts forensics leads and classifies urgency for investigating officers.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition group">
              <div className="p-3.5 bg-emerald-600/10 text-emerald-400 rounded-xl w-fit mb-5 group-hover:bg-emerald-600 group-hover:text-white transition">
                <PhoneCall size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Golden Hour Freeze Protocol</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Access step-by-step procedures to freeze compromised UPI VPAs, report via 1930, dispute unauthorized debit entries, and prevent mule account withdrawals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Modus Operandi Alert Grid */}
      <section className="py-16 px-6 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-amber-400" size={24} />
                <span>Active Cyber Threats & Scams</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Common cybercrime patterns reported across jurisdictions this month.
              </p>
            </div>
            <Link to="/login" className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1">
              <span>View Safety Guidelines</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <CreditCard className="text-blue-400 mb-2" size={22} />
              <h4 className="font-bold text-sm text-white mb-1">UPI & Electricity SMS Scam</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Threatens power disconnection unless you call an unauthorized mobile number or pay via an unverified link.
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <Smartphone className="text-amber-400 mb-2" size={22} />
              <h4 className="font-bold text-sm text-white mb-1">Telegram Part-Time Task Scam</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Promises daily profits for rating videos or hotels, demanding escalating deposits to release earnings.
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <ShieldAlert className="text-red-400 mb-2" size={22} />
              <h4 className="font-bold text-sm text-white mb-1">Fake "Digital Arrest" Extortion</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Imposters posing as police or customs threatening arrest over fake parcels or money laundering charges.
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <FileText className="text-purple-400 mb-2" size={22} />
              <h4 className="font-bold text-sm text-white mb-1">Predatory Loan App APKs</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Instant loan apps that harvest your contacts and photos to harass friends and family for extortion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-t border-slate-800 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-white">
            Targeted by Cyber Fraud? Act Before It's Too Late.
          </h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            Quick action within the golden hour maximizes the chances of freezing stolen funds. File your report now or test a link with our AI threat engine.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="bg-white text-blue-950 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition"
            >
              Register Citizen Account
            </Link>
            <Link
              to="/login"
              className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
