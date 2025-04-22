// ! packages:-
import React, { useState } from "react";
import toast from "react-hot-toast";

// ! fetching server data using zustand store:
import { useAuthStore } from "../store/useAuthStore.js";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

// ! components:-
import AuthImagePattern from "../components/AuthImagePattern.jsx";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  // ? fetch the data from server using zustand store:-
  const { signup, isSigningUp } = useAuthStore();

  // ? validate form data:-
  const validateForm = () => {
    if (!formData.fullname.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  // ? handle form submit:-
  const handleSubmit = (e) => {
    e.preventDefault();

    // ? invoke validateForm function:-
    const success = validateForm();
    if (success === true) signup(formData);
  };
  return (
    <>
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* left side */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* LOGO */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-base-content/60">
                  Get started with your free account
                </p>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* FULL NAME */}
              <div className="form-control">
                <label htmlFor="fullname" className="label">
                  <span className="label-text font-medium mb-1.5">
                    Full Name
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="z-50 size-5 text-based-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered focus:outline-none  w-full pl-10`}
                    placeholder="Full Name"
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({ ...formData, fullname: e.target.value })
                    }
                    id="fullname"
                    name="fullname"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text font-medium mb-1.5">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="z-50 size-5 text-based-content/40" />
                  </div>
                  <input
                    type="email"
                    className={`input input-bordered focus:outline-none  w-full pl-10`}
                    placeholder="Email"
                    autoComplete="off"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    id="email"
                    name="email"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="form-control">
                <label htmlFor="password" className="label">
                  <span className="label-text font-medium mb-1.5">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="z-50 size-5 text-based-content/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`input input-bordered focus:outline-none  w-full pl-10`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                    id="password"
                    name="password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() =>
                      formData.password && setShowPassword(!showPassword)
                    }>
                    {showPassword ? (
                      <EyeOff className="size-5 text-based-content/40" />
                    ) : (
                      <Eye className="size-5 text-based-content/40" />
                    )}
                  </button>
                </div>
              </div>

              {/* CREATE BUTTON */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSigningUp}>
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* LOGIN LINKS */}
            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?
                <Link to="/login" className="link link-primary">
                  {" "}
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
        {/* right side */}
        <AuthImagePattern
          title="Join our community"
          subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
        />
      </div>
    </>
  );
};

export default SignUpPage;
