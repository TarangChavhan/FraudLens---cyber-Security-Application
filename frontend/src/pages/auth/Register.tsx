import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, Role } from '../../context/AuthContext';
import { api } from '../../services/api';
import { UserPlus, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('USER');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await api.register({
        name,
        email,
        mobile,
        password,
        role,
      });

      setSuccess('Account created successfully! Signing you in...');

      if (res.token && res.user) {
        login(res.token, res.user);
        setTimeout(() => {
          if (res.user.role === 'ADMIN') navigate('/admin');
          else if (res.user.role === 'CYBER_EXPERT') navigate('/expert');
          else navigate('/user');
        }, 1000);
      } else {
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-blue-100 rounded-full text-blue-900">
            <ShieldCheck size={36} />
          </div>
        </div>
        <h2 className="text-2xl font-extrabold mb-1 text-center text-blue-900">Register on FraudLens</h2>
        <p className="text-xs text-center text-gray-500 mb-6">
          Create an official account to report cybercrimes and access investigative verification tools.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle2 className="shrink-0 mt-0.5" size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kulkarni"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Account Role</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="USER">Citizen / General User</option>
              <option value="CYBER_EXPERT">Cyber Forensics / Threat Expert</option>
              <option value="ADMIN">Cyber Cell Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2.5 rounded-lg hover:bg-blue-800 disabled:opacity-60 transition font-semibold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating your account...</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Complete Registration</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-5">
          Already registered?{' '}
          <Link to="/login" className="text-blue-700 font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
