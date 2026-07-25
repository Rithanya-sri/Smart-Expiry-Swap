"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // We might need to mock this if it doesn't exist, I'll use a checkbox styling for now
import {
  Building2, Store, Bell, Brain, User, Save, ShieldCheck, Mail, Smartphone,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("branch");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your branch details, notifications, AI preferences, and account."
        action={
          <Button variant="primary" size="sm" onClick={() => alert("Settings saved!")}>
            <Save className="h-3.5 w-3.5 mr-1.5" /> Save Changes
          </Button>
        }
      />

      <Tabs
        tabs={[
          { id: "branch", label: "Branch Info" },
          { id: "store", label: "Store Details" },
          { id: "notifications", label: "Notifications" },
          { id: "ai", label: "AI Settings" },
          { id: "profile", label: "Profile" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "branch" && (
        <Card className="max-w-3xl">
          <CardHeader className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-5 w-5 text-emerald-400" />
              <CardTitle>Branch Information</CardTitle>
            </div>
            <CardDescription>Manage your specific branch details and location.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Branch Name</label>
                <Input defaultValue="Downtown Fresh" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Branch ID</label>
                <Input defaultValue="BR-1042" disabled />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-medium text-slate-400">Address</label>
                <Input defaultValue="104 Central Park West, New York, NY 10023" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Timezone</label>
                <Select
                  value="est"
                  onChange={() => {}}
                  options={[
                    { label: "Eastern Time (EST)", value: "est" },
                    { label: "Central Time (CST)", value: "cst" },
                    { label: "Pacific Time (PST)", value: "pst" },
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Operating Hours</label>
                <Input defaultValue="06:00 AM - 11:00 PM" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "store" && (
        <Card className="max-w-3xl">
          <CardHeader className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Store className="h-5 w-5 text-emerald-400" />
              <CardTitle>Store Configuration</CardTitle>
            </div>
            <CardDescription>Configure store-level defaults for inventory management.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Default Currency</label>
                <Select
                  value="inr"
                  onChange={() => {}}
                  options={[
                    { label: "Indian Rupee (₹)", value: "inr" },
                    { label: "US Dollar ($)", value: "usd" },
                    { label: "Euro (€)", value: "eur" },
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Weight Unit</label>
                <Select
                  value="kg"
                  onChange={() => {}}
                  options={[
                    { label: "Kilograms (kg)", value: "kg" },
                    { label: "Pounds (lbs)", value: "lbs" },
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Near Expiry Threshold (Days)</label>
                <Input type="number" defaultValue="7" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Critical Expiry Threshold (Days)</label>
                <Input type="number" defaultValue="3" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card className="max-w-3xl">
          <CardHeader className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Bell className="h-5 w-5 text-emerald-400" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            <CardDescription>Control what alerts you receive and how.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {[
              { id: "n1", title: "Critical Expiry Alerts", desc: "Notify me when items enter the critical < 3 days window.", icon: <AlertOctagon className="h-4 w-4 text-rose-400" /> },
              { id: "n2", title: "AI Recommendations", desc: "Notify me when the AI generates new recovery strategies.", icon: <Brain className="h-4 w-4 text-violet-400" /> },
              { id: "n3", title: "NGO Pickup Confirmations", desc: "Notify me when an NGO accepts a dispatch.", icon: <HeartHandshake className="h-4 w-4 text-amber-400" /> },
              { id: "n4", title: "Weekly Impact Report", desc: "Email me the weekly summary of rescued food and revenue.", icon: <Mail className="h-4 w-4 text-emerald-400" /> },
            ].map((n) => (
              <div key={n.id} className="flex items-start justify-between gap-4 py-2 border-b border-slate-800/50 last:border-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="mt-0.5">{n.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{n.title}</p>
                    <p className="text-xs text-slate-500">{n.desc}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === "ai" && (
        <Card className="max-w-3xl">
          <CardHeader className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-5 w-5 text-violet-400" />
              <CardTitle>AI & Automation Settings</CardTitle>
            </div>
            <CardDescription>Configure how the AI Engine manages your expiring inventory.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
             <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-800/50">
                <div>
                  <p className="text-sm font-medium text-slate-200">Auto-Apply Flash Discounts</p>
                  <p className="text-xs text-slate-500 max-w-md">Allow the AI to automatically apply 15-30% discounts to items entering the near-expiry window without manual approval.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-800/50">
                <div>
                  <p className="text-sm font-medium text-slate-200">Automated NGO Alerts</p>
                  <p className="text-xs text-slate-500 max-w-md">Automatically alert verified NGO partners when items enter the critical &lt;3 days window.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-medium text-slate-400">Optimization Goal</label>
                <Select
                  value="balanced"
                  onChange={() => {}}
                  options={[
                    { label: "Maximize Revenue Recovery", value: "revenue" },
                    { label: "Minimize Food Waste (Aggressive Donation)", value: "waste" },
                    { label: "Balanced ESG & Revenue (Recommended)", value: "balanced" },
                  ]}
                />
              </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "profile" && (
        <Card className="max-w-3xl">
          <CardHeader className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-5 w-5 text-emerald-400" />
              <CardTitle>My Profile</CardTitle>
            </div>
            <CardDescription>Update your personal information and security settings.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-900 border-2 border-emerald-700 flex items-center justify-center text-xl font-bold text-emerald-300">
                AD
              </div>
              <div>
                <Button variant="outline" size="sm">Change Photo</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Full Name</label>
                <Input defaultValue="Admin User" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Role</label>
                <Input defaultValue="Branch Manager" disabled />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Email Address</label>
                <Input type="email" defaultValue="admin@smartswap.org" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Phone Number</label>
                <Input type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-800">
               <h3 className="text-sm font-semibold text-slate-200 mb-3">Security</h3>
               <Button variant="outline" size="sm" className="w-fit">Change Password</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
