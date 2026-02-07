import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Emails } from "@/lib/generated/prisma/client";

export const getAvatarColor = (name: string) => {
  const colors = [
    "bg-red-500/20 text-red-700 dark:text-red-300",
    "bg-orange-500/20 text-orange-700 dark:text-orange-300",
    "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
    "bg-lime-500/20 text-lime-700 dark:text-lime-300",
    "bg-green-500/20 text-green-700 dark:text-green-300",
    "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    "bg-teal-500/20 text-teal-700 dark:text-teal-300",
    "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
    "bg-sky-500/20 text-sky-700 dark:text-sky-300",
    "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300",
    "bg-violet-500/20 text-violet-700 dark:text-violet-300",
    "bg-purple-500/20 text-purple-700 dark:text-purple-300",
    "bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300",
    "bg-pink-500/20 text-pink-700 dark:text-pink-300",
    "bg-rose-500/20 text-rose-700 dark:text-rose-300",
  ];

  const firstChar = name.charAt(0).toUpperCase();
  const charCode = firstChar.charCodeAt(0);
  const index = charCode % colors.length;
  return colors[index];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmailNew(emailDate: Date | string) {
  const now = new Date();
  const emailTime = new Date(emailDate);
  const diffInMinutes = (now.getTime() - emailTime.getTime()) / (1000 * 60);
  return diffInMinutes < 5;
}

export function getInitials(email: string) {
  const name = email.split("@")[0];
  return name
    .split(/[._-]/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function formatDate(date: Date | string) {
  const emailDate = new Date(date);
  const now = new Date();
  const diffInHours = (now.getTime() - emailDate.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return emailDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else if (diffInHours < 168) {
    return emailDate.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return emailDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
}

export function truncateText(text: string, maxLength: number) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export function stripHtml(html: string) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getEmailPreview(email: Emails) {
  const content = email.text || stripHtml(email.html || "");
  return truncateText(content, 150);
}

export function formatDetailedDate(date: Date | string) {
  const emailDate = new Date(date);
  return emailDate.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatFileSize(bytes: string | number | bigint) {
  const size =
    typeof bytes === "bigint"
      ? Number(bytes)
      : typeof bytes === "string"
        ? parseInt(bytes)
        : bytes;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
