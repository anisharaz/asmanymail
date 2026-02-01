"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Inbox,
  Clock,
  Paperclip,
  Star,
  Check,
  MousePointerClick,
} from "lucide-react";

const emails = [
  { id: 1, address: "work@example.com", count: 12, color: "bg-blue-500" },
  { id: 2, address: "personal@example.com", count: 5, color: "bg-purple-500" },
  { id: 3, address: "shopping@example.com", count: 23, color: "bg-green-500" },
  { id: 4, address: "social@example.com", count: 8, color: "bg-orange-500" },
];

const inboxMessages = [
  {
    id: 1,
    from: "John Doe",
    subject: "Meeting Tomorrow",
    preview: "Hey! Just wanted to confirm our meeting...",
    time: "10:30 AM",
    hasAttachment: true,
    isStarred: false,
  },
  {
    id: 2,
    from: "Jane Smith",
    subject: "Project Update",
    preview: "I've completed the latest revisions...",
    time: "9:15 AM",
    hasAttachment: false,
    isStarred: true,
  },
  {
    id: 3,
    from: "Team Newsletter",
    subject: "Weekly Roundup",
    preview: "Check out what happened this week...",
    time: "Yesterday",
    hasAttachment: true,
    isStarred: false,
  },
];

export function EmailDemo() {
  const [selectedEmail, setSelectedEmail] = useState<number>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedEmail((prev) => {
        if (prev >= emails.length) return 1;
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Title with Pointer Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6 md:mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-primary/10 rounded-full mb-4">
          <MousePointerClick className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary animate-pulse" />
          <span className="text-xs md:text-sm font-medium">
            Watch the automatic demo
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Email Addresses List */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="h-full bg-card/50 backdrop-blur">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <h3 className="font-semibold text-base md:text-lg">
                  Your Email Addresses
                </h3>
              </div>

              <div className="space-y-3">
                {emails.map((email, index) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      animate={{
                        borderColor:
                          selectedEmail === email.id
                            ? "hsl(var(--primary))"
                            : "hsl(var(--border))",
                        backgroundColor:
                          selectedEmail === email.id
                            ? "hsl(var(--primary) / 0.1)"
                            : "transparent",
                      }}
                      className="border-2 rounded-lg p-3 md:p-4 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3 flex-1">
                          <div
                            className={`h-8 w-8 md:h-10 md:w-10 ${email.color} rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base`}
                          >
                            {email.address[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs md:text-sm truncate">
                              {email.address}
                            </div>
                            <div className="text-[10px] md:text-xs text-muted-foreground">
                              {email.count} messages
                            </div>
                          </div>
                        </div>
                        {selectedEmail === email.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-5 w-5 md:h-6 md:w-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0"
                          >
                            <Check className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <button className="text-xs md:text-sm text-primary hover:underline flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  Create new email address
                </button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Inbox Preview */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="h-full bg-card/50 backdrop-blur">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4 md:mb-6 flex-wrap">
                <Inbox className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <h3 className="font-semibold text-base md:text-lg">Inbox</h3>
                <AnimatePresence mode="wait">
                  {selectedEmail && (
                    <motion.div
                      key={selectedEmail}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge
                        variant="secondary"
                        className="ml-auto text-[10px] md:text-xs truncate max-w-[150px] md:max-w-none"
                      >
                        {emails.find((e) => e.id === selectedEmail)?.address}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {selectedEmail && (
                  <motion.div
                    key={selectedEmail}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 md:space-y-3"
                  >
                    {inboxMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="border border-border rounded-lg p-2 md:p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className="h-7 w-7 md:h-8 md:w-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] md:text-xs font-semibold text-primary">
                              {message.from[0]}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-xs md:text-sm truncate">
                                {message.from}
                              </span>
                              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                                {message.isStarred && (
                                  <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-yellow-500 text-yellow-500" />
                                )}
                                {message.hasAttachment && (
                                  <Paperclip className="h-2.5 w-2.5 md:h-3 md:w-3 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                            <div className="font-medium text-[10px] md:text-xs mb-1 truncate">
                              {message.subject}
                            </div>
                            <div className="text-[10px] md:text-xs text-muted-foreground truncate">
                              {message.preview}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-2.5 w-2.5 md:h-3 md:w-3 text-muted-foreground" />
                              <span className="text-[10px] md:text-xs text-muted-foreground">
                                {message.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center mt-6 md:mt-8 px-4"
      >
        <p className="text-xs md:text-sm text-muted-foreground">
          ✨ All emails are stored persistently with{" "}
          <span className="font-semibold text-foreground">
            full attachment support
          </span>
        </p>
      </motion.div>
    </div>
  );
}
