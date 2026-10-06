import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  PhoneCall,
  Globe,
  ExternalLink,
  Lock,
  AlertTriangle,
  FileText,
  Search,
  BookOpen,
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-gray-300 border-t border-slate-800 text-xs">
      {/* Emergency Hotline Bar */}
      <div className="bg-red-700 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="animate-pulse shrink-0" />
            <span className="font-bold text-sm">
              Defrauded or Debited? Call National Cyber Crime Helpline Immediately:
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <a
              href="tel:1930"
              className="bg-white text-red-700 px-3 py-1 rounded-full font-black flex items-center gap-1 hover:bg-gray-100 transition"
            >
              <PhoneCall size={13} /> 1930 (Toll-Free)
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline flex items-center gap-1 hover:text-red-100"
            >
              cybercrime.gov.in <ExternalLink size={12} />
            </a>
            <span>Police Emergency: <strong>112</strong></span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Identity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="text-lg font-black tracking-wide text-white">FraudLens</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            National Cyber Crime Reporting and Intelligence Verification Portal. Empowering citizens with rapid AI-driven threat verification and direct law enforcement escalation.
          </p>
          <div className="pt-2 flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
            <Lock size={13} />
            <span>End-to-End Encrypted Complaint Dossiers</span>
          </div>
        </div>

        {/* Col 2: Citizen Services */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">Citizen Services</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/user/report" className="hover:text-white flex items-center gap-1.5 transition">
                <FileText size={13} className="text-blue-400" />
                <span>File Cybercrime Incident</span>
              </Link>
            </li>
            <li>
              <Link to="/user/link-check" className="hover:text-white flex items-center gap-1.5 transition">
                <Search size={13} className="text-amber-400" />
                <span>AI Link & Phishing Scanner</span>
              </Link>
            </li>
            <li>
              <Link to="/user/my-reports" className="hover:text-white flex items-center gap-1.5 transition">
                <ShieldCheck size={13} className="text-green-400" />
                <span>Track Complaint Status</span>
              </Link>
            </li>
            <li>
              <Link to="/user/guidance" className="hover:text-white flex items-center gap-1.5 transition">
                <BookOpen size={13} className="text-purple-400" />
                <span>AI Safety Advisor & Guides</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Government Resources */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">National Cyber Agencies</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1.5 transition"
              >
                <Globe size={13} className="text-blue-400" />
                <span>National Cybercrime Portal</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.cert-in.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1.5 transition"
              >
                <Globe size={13} className="text-blue-400" />
                <span>CERT-In (Emergency Response)</span>
              </a>
            </li>
            <li>
              <a
                href="https://rbi.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1.5 transition"
              >
                <Globe size={13} className="text-blue-400" />
                <span>RBI Cyber Security Guidelines</span>
              </a>
            </li>
            <li>
              <Link to="/login" className="hover:text-white flex items-center gap-1.5 transition text-gray-400">
                <Lock size={13} className="text-gray-500" />
                <span>Officer & Expert Portal Login</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Statutory Notice */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">Public Advisory</h4>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-[11px] text-gray-400 leading-relaxed space-y-1.5">
            <p className="text-amber-300 font-semibold">Beware of "Digital Arrest" Scams</p>
            <p>
              Police, CBI, ED, or TRAI officials NEVER interrogate citizens over WhatsApp video or demand money clearance transfers.
            </p>
          </div>
          <p className="text-[10px] text-gray-500">
            In compliance with Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules.
          </p>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-900 bg-black/40 py-4 px-6 text-center text-gray-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} FraudLens — National Cybercrime Reporting & Threat Verification Portal.</p>
          <p className="text-gray-400">Powered by AI Threat Intelligence Engine • 24/7 Citizen Cyber Defense</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
