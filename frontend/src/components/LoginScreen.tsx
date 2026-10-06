import { useState, FormEvent } from "react";
import { Lock } from "lucide-react";
import TopBar from "./TopBar";

interface LoginScreenProps {
  role: string;
  accentColor: string;
  onBack: () => void;
  onLogin: (name: string) => void;
}

export default function LoginScreen({
  role,
  accentColor,
  onBack,
  onLogin,
}: LoginScreenProps) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isAdmin = role === "Government Admin";

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || !id.trim() || !password.trim()) {
      setError("Please fill in all fields to continue.");
      return;
    }
    if (isAdmin && password.length < 4) {
      setError("Admin password must be at least 4 characters.");
      return;
    }
    setError("");
    onLogin(name.trim());
  };

  return (
    <div id="login-container" className="min-h-screen bg-gray-100 font-sans">
      <TopBar
        title={`${role} Login`}
        onBack={onBack}
        barColor={isAdmin ? "bg-red-600" : "bg-blue-700"}
      />
      <main className="max-w-md mx-auto mt-10 p-4">
        <div
          id="login-card"
          className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm"
        >
          <div className="flex flex-col items-center mb-5">
            <div
              className={`p-3 rounded-full mb-2 ${
                isAdmin ? "bg-red-100" : "bg-blue-100"
              }`}
            >
              <Lock className={accentColor} size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{role} Login</h2>
            <p className="text-xs text-gray-500 text-center mt-1">
              {isAdmin
                ? "Authorized government cybersecurity staff portal"
                : "Enter your credentials to access user tools"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-name-input"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="login-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600 transition"
                placeholder={isAdmin ? "e.g. Officer Rajesh Deshmukh" : "e.g. Ramesh Patil"}
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="login-id-input"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                {isAdmin ? "Admin ID / Badge Number" : "Mobile Number / Email"}
              </label>
              <input
                id="login-id-input"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600 transition"
                placeholder={isAdmin ? "e.g. GOV-1023" : "e.g. 9876543210"}
              />
            </div>

            <div>
              <label
                htmlFor="login-password-input"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div
                id="login-error-message"
                className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 font-medium"
              >
                {error}
              </div>
            )}

            <button
              id="login-submit-button"
              type="submit"
              className={`w-full text-white py-2.5 rounded-md font-semibold text-sm transition cursor-pointer ${
                isAdmin
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              Log In as {role}
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              Demo login — any details will work, this is stored locally in-memory for this session.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
