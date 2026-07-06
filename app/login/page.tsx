"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Boxes, ArrowRight, Mail, Lock, ShieldCheck } from "lucide-react";
import type { Role } from "@/lib/types";
import { RoleBadge } from "@/components/shared/role-badge";

const ROLES: Role[] = ["Admin", "Manager", "Employee"];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e.target);
    router.push("/dashboard");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — editorial brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-graphite p-12 text-white lg:flex">
        <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-ember/20 blur-3xl" />
        <div className="absolute -left-10 bottom-10 h-60 w-60 rounded-full bg-ivory/5 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <Boxes className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-2xl font-normal tracking-tight">
            MiniERP
          </span>
        </Link>
        <div className="relative space-y-6">
          <p className="text-xs font-medium uppercase tracking-wider text-ember">
            Operator console
          </p>
          <h1 className="display-headline max-w-md text-white">
            Run the floor with <span className="text-ember">clarity</span>.
          </h1>
          <p className="max-w-sm text-base leading-relaxed text-white/60">
            Sign in to access inventory, sales, and customer records. This is a
            UI demonstration — any credentials will do.
          </p>
        </div>
        <div className="relative flex items-center gap-3 text-sm text-white/50">
          <ShieldCheck className="h-4 w-4 text-ember" />
          UI demo · mock data only · no real authentication
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center bg-canvas px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-graphite">
                <Boxes className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-xl text-graphite">
                MiniERP
              </span>
            </div>
            <h2 className="font-heading text-3xl font-normal tracking-tight text-graphite">
              Welcome back
            </h2>
            <p className="text-sm text-steel">
              Choose a demo role, then enter any details to continue.
            </p>
          </div>

          {/* Role toggle */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-token">
              Login as
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={
                    "flex h-11 items-center justify-center rounded-xl border text-sm font-medium transition-all " +
                    (selectedRole === r
                      ? "border-graphite bg-graphite text-white"
                      : "border-mist bg-canvas text-steel hover:bg-fog")
                  }
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="flex items-center gap-2 pt-1 text-xs text-slate-token">
              Active role:
              <RoleBadge role={selectedRole} />
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field
              label="Email"
              icon={<Mail className="h-4 w-4 text-slate-token" />}
              type="email"
              placeholder="you@MiniERP.co"
              value={email}
              onChange={setEmail}
            />
            <Field
              label="Password"
              icon={<Lock className="h-4 w-4 text-slate-token" />}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-steel">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-mist accent-graphite"
                />
                Remember me
              </label>
              <a href="#" className="link-ember text-graphite">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-graphite text-sm font-medium text-white transition-all hover:gap-3 hover:bg-graphite/90"
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-token">
            No real authentication — this is a design demonstration.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-slate-token">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full rounded-xl border border-mist bg-canvas pl-11 pr-4 text-sm text-graphite placeholder:text-slate-token focus:border-graphite/30 focus:outline-none focus:ring-2 focus:ring-graphite/10"
        />
      </div>
    </div>
  );
}
