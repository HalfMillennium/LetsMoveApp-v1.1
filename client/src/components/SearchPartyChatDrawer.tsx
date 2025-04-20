import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { X, Send, UserCircle2, ArrowRight } from "lucide-react";
import { SearchParty } from "../types";

interface Message {
  id: number;
  userId: number;
  username: string;
  userInitial: string;
  userColor: string;
  text: string;
  timestamp: Date;
}

interface SearchPartyChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchParty: SearchParty | null;
}

export const SearchPartyChatDrawer: React.FC<SearchPartyChatDrawerProps> = ({
  isOpen,
  onClose,
  searchParty,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration - in a real app, these would come from API
  const currentUserId = 1;
  const userColors = [
    "#FFA07A", // Light Salmon
    "#98FB98", // Pale Green
    "#87CEFA", // Light Sky Blue
    "#FFD700", // Gold
    "#E6A8D7", // Light Purple
  ];

  // Initialize with some example messages
  useEffect(() => {
    if (searchParty && messages.length === 0) {
      const initialMessages: Message[] = [
        {
          id: 1,
          userId: 2,
          username: "Emma",
          userInitial: "E",
          userColor: userColors[1],
          text: "Hey! I found this apartment near the park. What do you think?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        {
          id: 2,
          userId: 3,
          username: "Mike",
          userInitial: "M",
          userColor: userColors[2],
          text: "Looks good! I like the kitchen in that one.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        },
        {
          id: 3,
          userId: 1,
          username: "You",
          userInitial: "Y",
          userColor: userColors[0],
          text: "The location seems perfect for all of us. I'm going to request a viewing for tomorrow.",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
          id: 4,
          userId: 2,
          username: "Emma",
          userInitial: "E",
          userColor: userColors[1],
          text: "Great! Let us know how it goes.",
          timestamp: new Date(Date.now() - 1000 * 60 * 20),
        },
      ];
      setMessages(initialMessages);
    }
  }, [searchParty]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus on input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!message.trim() || !searchParty) return;

    const newMessage: Message = {
      id: messages.length + 1,
      userId: currentUserId,
      username: "You",
      userInitial: "Y",
      userColor: userColors[0],
      text: message,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const messagesByDate = messages.reduce<Record<string, Message[]>>(
    (groups, message) => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {},
  );

  if (!searchParty) return null;

  return (
    <>
      {/* Overlay that appears behind the drawer on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 bottom-0 right-0 z-40 flex flex-col w-full md:w-96 bg-white border-l shadow-xl transform transition-transform duration-300 ease-in-out top-[63px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold">{searchParty.name}</h2>
              <div className="flex items-center text-sm text-gray-500">
                <span>{searchParty.members?.length || 0} members</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(messagesByDate).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                  {date}
                </div>
              </div>

              {dateMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.userId === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] ${
                      msg.userId === currentUserId
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    {msg.userId !== currentUserId && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 mr-2"
                        style={{ backgroundColor: msg.userColor }}
                      >
                        {msg.userInitial}
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.userId === currentUserId
                          ? "bg-blue-500 text-white rounded-tr-none mr-2"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {msg.userId !== currentUserId && (
                        <div className="text-xs font-medium mb-1 text-gray-700">
                          {msg.username}
                        </div>
                      )}
                      <p className="text-sm">{msg.text}</p>
                      <div
                        className={`text-xs mt-1 ${
                          msg.userId === currentUserId
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 py-3"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`rounded-full ${
                message.trim()
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-200 text-gray-400"
              }`}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPartyChatDrawer;
