"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useForm,
  type FieldError,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Boxes, Lock, Mail, ShieldCheck } from "lucide-react";

import type { Role } from "@/lib/types";
import { RoleBadge } from "@/components/shared/role-badge";
import { loginValidation } from "@/validation/auth";
import z from "zod";
import { useLoginUser } from "@/hooks/endpoints";

export const ROLES: Role[] = ["admin", "manager", "employee"];

type LoginFormData = z.infer<typeof loginValidation>;

export default function LoginPage() {
  const router = useRouter();
  const login = useLoginUser();
  const [selectedRole, setSelectedRole] = useState<Role>("admin");

  const {
    register,

    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync({
        ...data,
        role: selectedRole,
      });
      router.push("/dashboard");
    } catch (error: any) {
      setError("email", { message: "Invalid email address" });
      setError("password", { message: "Invalid password" });
      console.log("Login failed", error.response.data.message);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left */}
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

      {/* Right */}
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

          {/* Roles */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-token">
              Login as
            </p>

            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={
                    "flex h-11 items-center justify-center rounded-xl border text-sm font-medium transition-all " +
                    (selectedRole === role
                      ? "border-graphite bg-graphite text-white"
                      : "border-mist bg-canvas text-steel hover:bg-fog")
                  }
                >
                  {role}
                </button>
              ))}
            </div>

            <p className="flex items-center gap-2 pt-1 text-xs text-slate-token">
              Active role:
              <RoleBadge role={selectedRole} />
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field
              label="Email"
              type="email"
              placeholder="you@MiniERP.co"
              icon={<Mail className="h-4 w-4 text-slate-token" />}
              registration={register("email")}
              error={errors.email}
            />

            <Field
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4 text-slate-token" />}
              registration={register("password")}
              error={errors.password}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-steel">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-mist accent-graphite"
                />
                Remember me
              </label>

              <button type="button" className="text-graphite hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-graphite text-sm font-medium text-white transition-all hover:gap-3 hover:bg-graphite/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}

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

type FieldProps = {
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
};

function Field({
  label,
  icon,
  type,
  placeholder,
  registration,
  error,
}: FieldProps) {
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
          {...registration}
          className={`h-12 w-full rounded-xl border bg-canvas pl-11 pr-4 text-sm placeholder:text-slate-token transition-colors focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-mist text-graphite focus:border-graphite/30 focus:ring-graphite/10"
          }`}
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500">{error.message}</p>
      )}
    </div>
  );
}
