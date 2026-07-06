"use client";

import { Bell, Search, ChevronDown, ShieldCheck, UserCog, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { RoleBadge } from "@/components/shared/role-badge";
import type { Role } from "@/lib/types";

const ROLES: Role[] = ["Admin", "Manager", "Employee"];

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-mist bg-canvas/80 px-4 backdrop-blur-md lg:px-8">
      {/* Mobile menu trigger */}
      <button
        onClick={onOpenSidebar}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-mist bg-canvas text-steel transition-colors hover:bg-fog lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-graphite" />
      </button>

      <div className="ml-auto flex items-center gap-2 lg:gap-3">
        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-steel transition-colors hover:bg-fog">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-ember ring-2 ring-canvas" />
        </button>

        {/* Role switcher + user */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-pill border border-mist bg-canvas py-1.5 pl-1.5 pr-3 transition-colors hover:bg-fog">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-graphite text-xs font-medium text-white">
                  {"Admin"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-medium leading-none text-graphite">
                  Alex Morgan
                </p>
                <p className="mt-1 text-[11px] leading-none text-slate-token">
                  {"Admin"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-token" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Account</span>
              <RoleBadge role={"Employee"} />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
