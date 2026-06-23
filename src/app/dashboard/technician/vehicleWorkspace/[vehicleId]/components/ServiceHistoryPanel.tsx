"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ServiceHistoryPanelProps {
  tickets?: any[];
}

export function ServiceHistoryPanel({
  tickets,
}: ServiceHistoryPanelProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (
    status: string
  ) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700";

      case "RESOLVED":
        return "bg-blue-100 text-blue-700";

      case "IN_SERVICE":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          Repair History
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!tickets || tickets.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
            No repair history found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}

            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 text-sm font-medium text-slate-500">
                      Ticket
                    </th>

                    <th className="pb-3 text-sm font-medium text-slate-500">
                      Issue
                    </th>

                    <th className="pb-3 text-sm font-medium text-slate-500">
                      Technician
                    </th>

                    <th className="pb-3 text-sm font-medium text-slate-500">
                      Cost
                    </th>

                    <th className="pb-3 text-sm font-medium text-slate-500">
                      Priority
                    </th>

                    <th className="pb-3 text-sm font-medium text-slate-500">
                      Status
                    </th>

                    <th className="pb-3 text-sm font-medium text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="py-4 font-medium">
                        #{ticket.id}
                      </td>

                      <td className="py-4">
                        {ticket.issueCategory}
                      </td>

                      <td className="py-4">
                        {ticket.technician?.fullName ||
                          "Unassigned"}
                      </td>

                      <td className="py-4">
                        ₹{ticket.finalCost || 0}
                      </td>

                      <td className="py-4">
                        {ticket.priority}
                      </td>

                      <td className="py-4">
                        <Badge
                          className={
                            getStatusColor(
                              ticket.status
                            )
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </td>

                      <td className="py-4 text-sm text-slate-500">
                        {formatDate(
                          ticket.createdAt
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}

            <div className="space-y-4 lg:hidden">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      Ticket #{ticket.id}
                    </h4>

                    <Badge
                      className={getStatusColor(
                        ticket.status
                      )}
                    >
                      {ticket.status}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <div>
                      <span className="text-slate-500">
                        Issue:
                      </span>{" "}
                      {ticket.issueCategory}
                    </div>

                    <div>
                      <span className="text-slate-500">
                        Technician:
                      </span>{" "}
                      {ticket.technician
                        ?.fullName ||
                        "Unassigned"}
                    </div>

                    <div>
                      <span className="text-slate-500">
                        Cost:
                      </span>{" "}
                      ₹
                      {ticket.finalCost || 0}
                    </div>

                    <div>
                      <span className="text-slate-500">
                        Priority:
                      </span>{" "}
                      {ticket.priority}
                    </div>

                    <div>
                      <span className="text-slate-500">
                        Date:
                      </span>{" "}
                      {formatDate(
                        ticket.createdAt
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}