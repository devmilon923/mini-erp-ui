"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RoleBadge } from "@/components/shared/role-badge";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Operator preferences and store configuration."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-data border-mist p-6">
          <h3 className="font-heading text-lg font-normal text-graphite">
            Profile
          </h3>
          <p className="mt-1 text-sm text-slate-token">
            Currently acting as <RoleBadge role={"employee"} className="ml-1" />
          </p>
          <Separator className="my-5" />
          <div className="space-y-5">
            <SettingRow label="Email notifications" defaultChecked />
            <SettingRow label="Low stock alerts" defaultChecked />
            <SettingRow label="Daily sales digest" />
            <SettingRow label="Compact table density" />
          </div>
        </Card>

        <Card className="card-data border-mist p-6">
          <h3 className="font-heading text-lg font-normal text-graphite">
            Store
          </h3>
          <p className="mt-1 text-sm text-slate-token">
            Catalog and currency defaults.
          </p>
          <Separator className="my-5" />
          <div className="space-y-5">
            <SettingRow
              label="Show out-of-stock in storefront"
              defaultChecked
            />
            <SettingRow label="Auto-reorder below 5 units" />
            <SettingRow label="Round prices to nearest dollar" />
          </div>
        </Card>
      </div>

      <div className="card-data border-mist p-6 text-sm text-slate-token">
        Settings are illustrative only — this is a UI demonstration with no
        persistence.
      </div>
    </div>
  );
}

function SettingRow({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm text-graphite">{label}</Label>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
