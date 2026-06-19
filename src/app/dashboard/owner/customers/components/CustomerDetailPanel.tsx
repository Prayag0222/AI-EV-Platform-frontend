'use client';

import React from 'react';
import { X, Bike, Mail, MapPin, Phone, Calendar } from 'lucide-react';
import { Customer } from '@/app/dashboard/owner/types/customer';

interface CustomerDetailPanelProps {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerDetailPanel({ customer, onClose }: CustomerDetailPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white shadow-2xl h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-volt-primary/10 to-transparent">
          <h2 className="font-display text-xl font-bold text-volt-primary">Customer Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-transform hover:scale-105"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-10 overflow-y-auto">
          {/* Personal Info */}
          <section className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-volt-secondary/20 flex items-center justify-center font-bold text-volt-secondary text-xl shadow-inner">
                {customer.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-volt-primary">{customer.name}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Joined{" "}
                  {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="h-4 w-4 text-gray-400" /> {customer.phone}
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="h-4 w-4 text-gray-400" /> {customer.email || "No email provided"}
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />{" "}
                {customer.address || "No address registered"}
              </div>
            </div>
          </section>

          {/* Vehicles */}
          <section className="space-y-5">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-gray-500">
              Registered Fleet
            </h4>
            {customer.vehicles.length > 0 ? (
              <div className="space-y-4">
                {customer.vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="p-5 border rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 font-semibold text-volt-primary">
                      <Bike className="h-4 w-4" /> {v.vehicleModel}
                    </div>
                    <div className="grid grid-cols-2 text-xs text-gray-600 gap-2 mt-2">
                      <p>Year: {v.modelYear}</p>
                      <p>Make: {v.manufacturer}</p>
                    </div>
                    <div className="text-[11px] font-mono bg-white px-2 py-1 border rounded mt-2 truncate shadow-inner">
                      VIN: {v.vin}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed rounded-xl text-gray-400 text-sm bg-gray-50">
                🚘 No vehicles registered
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
