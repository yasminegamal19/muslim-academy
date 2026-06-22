
import { useEffect } from "react";
import { api } from "../store/slices/authSlice";

export default function useSiteSettings() {
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get("/settings");

        if (
          res.data.code === 200 &&
          res.data.data &&
          res.data.data.length > 0
        ) {
          const settings = res.data.data[0];

          document.title = settings.title || settings.name;

          let metaDescription = document.querySelector(
            'meta[name="description"]',
          );

          if (!metaDescription) {
            metaDescription = document.createElement("meta");
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
          }

          metaDescription.content = settings.metaDesc || "";

          let metaKeywords = document.querySelector('meta[name="keywords"]');

          if (!metaKeywords) {
            metaKeywords = document.createElement("meta");
            metaKeywords.name = "keywords";
            document.head.appendChild(metaKeywords);
          }

          metaKeywords.content = settings.metaKey || "";

          let favicon =
            document.querySelector("link[rel='icon']") ||
            document.createElement("link");

          favicon.rel = "icon";
          favicon.href = settings.favicon;

          document.head.appendChild(favicon);
        }
      } catch (error) {
        console.error("Settings Error:", error);
      }
    };

    loadSettings();
  }, []);
}
