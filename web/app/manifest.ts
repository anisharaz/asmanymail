import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AsManyMail",
    short_name: "AsManyMail",
    description: "An app for owning multiple email addresses.",
    start_url: "/dashboard/mails",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    id: "/dashboard/mails",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/desktop_screenshot.png",
        sizes: "1920x990", // real size
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/mobile_screenshot.png",
        sizes: "416x702", // real size
        type: "image/png",
      },
    ],
  };
}
