"use client";

import { User, Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CustomerInformationCardProps {
  customer: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
}

export function CustomerInformationCard({
  customer,
}: CustomerInformationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Customer Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{customer?.name || "Not Available"}</span>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{customer?.phone || "Not Available"}</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{customer?.email || "Not Available"}</span>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
          <span>{customer?.address || "Not Available"}</span>
        </div>

        <Button
          variant="outline"
          className="w-full"
        >
          Open Customer Profile
        </Button>
      </CardContent>
    </Card>
  );
}