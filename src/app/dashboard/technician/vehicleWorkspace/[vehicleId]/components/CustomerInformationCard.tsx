"use client";

import {
  User,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button_temp";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CustomerInformationCardProps {
  customer: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
}

export function CustomerInformationCard({
  customer,
}: CustomerInformationCardProps) {
  const information = [
    {
      icon: User,
      label: "Customer",
      value: customer?.name,
    },
    {
      icon: Phone,
      label: "Phone",
      value: customer?.phone,
    },
    {
      icon: Mail,
      label: "Email",
      value: customer?.email,
    },
    {
      icon: MapPin,
      label: "Address",
      value: customer?.address,
    },
  ];

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-slate-50/70">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-indigo-600" />
          Customer Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div className="space-y-3">
          {information.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="rounded-lg bg-white p-2 shadow-sm">
                  <Icon className="h-4 w-4 text-slate-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-slate-900">
                    {item.value || "Not Available"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
{/* 
        <Button
          variant="outline"
          className="h-11 w-full"
          disabled={!customer?.id}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Customer Profile
        </Button> */}
      </CardContent>
    </Card>
  );
}