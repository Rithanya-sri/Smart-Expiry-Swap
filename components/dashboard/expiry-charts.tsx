"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MOCK_TRENDS, MOCK_CATEGORY_BREAKDOWN } from "@/lib/mock-data";

export function TrendAreaChart() {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={MOCK_TRENDS}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="rescuedColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="wasteColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderRadius: "0.75rem",
              color: "#f8fafc",
              fontSize: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
            }}
          />
          <Area
            type="monotone"
            dataKey="rescued"
            name="Items Rescued (kg)"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#rescuedColor)"
          />
          <Area
            type="monotone"
            dataKey="waste"
            name="Disposed Waste (kg)"
            stroke="#f43f5e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#wasteColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart() {
  return (
    <div className="h-[250px] w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={MOCK_CATEGORY_BREAKDOWN}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {MOCK_CATEGORY_BREAKDOWN.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderRadius: "0.75rem",
              color: "#f8fafc",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-xl font-extrabold text-slate-100">100%</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Categorized</span>
      </div>
    </div>
  );
}

export function ValueSavingsBarChart() {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={MOCK_TRENDS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderRadius: "0.75rem",
              color: "#f8fafc",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`₹${value.toLocaleString()}`, "Financial Value Saved"]}
          />
          <Bar dataKey="valueSaved" fill="#059669" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
