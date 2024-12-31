"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MapPin, Ticket } from "lucide-react";
import '../globals.css';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  image: string;
  tickets: {
    general: { price: number; available: number };
    fanClub: { price: number; available: number };
    vip: { price: number; available: number };
  };
}

const dummyEvents: Event[] = [
  {
    id: "1",
    name: "Summer Music Festival 2024",
    date: "July 15, 2024",
    location: "Central Park Arena",
    image: "/api/placeholder/800/400",
    tickets: {
      general: { price: 50, available: 1000 },
      fanClub: { price: 150, available: 500 },
      vip: { price: 300, available: 100 }
    }
  },
  {
    id: "2",
    name: "Tech Conference 2024",
    date: "August 20, 2024",
    location: "Innovation Center",
    image: "/api/placeholder/800/400",
    tickets: {
      general: { price: 100, available: 2000 },
      fanClub: { price: 250, available: 750 },
      vip: { price: 500, available: 200 }
    }
  }
];

export default function EventTicketsPage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ticketType, setTicketType] = useState<'general' | 'fanClub' | 'vip' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConnectWallet = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsWalletConnected(true);
      setIsProcessing(false);
    }, 1500);
  };

  const handleBookTicket = async () => {
    if (!selectedEvent || !ticketType) return;
    setIsProcessing(true);
    setTimeout(() => {
      alert(`Booked ${ticketType} ticket for ${selectedEvent.name}`);
      setIsProcessing(false);
      setSelectedEvent(null);
      setTicketType(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Wallet Connection */}
        <div className="mb-8">
          {!isWalletConnected ? (
            <Button 
              onClick={handleConnectWallet}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transform transition-all hover:scale-[1.02] h-12"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Connecting OKX Wallet...</>
              ) : (
                'Connect OKX Wallet'
              )}
            </Button>
          ) : (
            <Badge className="w-full justify-center py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md">
              Wallet Connected ✓
            </Badge>
          )}
        </div>

        {/* Events List */}
        <div className="grid gap-8">
          {dummyEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white">
              <div className="relative">
                <img 
                  src={event.image} 
                  alt={event.name}
                  className="w-full h-56 object-cover brightness-90 hover:brightness-100 transition-all duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{event.name}</h2>
                  <div className="flex gap-4 text-white/90">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid gap-4">
                  {['general', 'fanClub', 'vip'].map((type) => (
                    <div 
                      key={type}
                      className={`p-5 border rounded-xl cursor-pointer transition-all
                        ${selectedEvent?.id === event.id && ticketType === type 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'hover:border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => {
                        setSelectedEvent(event);
                        setTicketType(type as 'general' | 'fanClub' | 'vip');
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold capitalize text-lg">
                            {type.replace(/([A-Z])/g, ' $1').trim()} Access
                          </h3>
                          <div className="flex items-center gap-1 text-gray-500 mt-1">
                            <Ticket className="h-4 w-4" />
                            <span className="text-sm">
                              {event.tickets[type as keyof typeof event.tickets].available} available
                            </span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          ${event.tickets[type as keyof typeof event.tickets].price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  className={`w-full h-12 text-lg transition-all duration-300 ${
                    isWalletConnected && selectedEvent?.id === event.id && ticketType
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02]'
                      : 'bg-gray-200'
                  }`}
                  disabled={!isWalletConnected || isProcessing || 
                    !(selectedEvent?.id === event.id && ticketType)}
                  onClick={handleBookTicket}
                >
                  {isProcessing && selectedEvent?.id === event.id ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    'Book Ticket'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}