import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Emails } from "@/lib/generated/prisma/client";

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
