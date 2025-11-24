import { useEffect } from "react";
import DOMPurify from "isomorphic-dompurify";

interface ScriptInjectorProps {
  scripts?: {
    head: string | null;
    body: string | null;
  };
}

const ScriptInjector = ({ scripts }: ScriptInjectorProps) => {
  useEffect(() => {
    if (scripts?.head) {
      const headDiv = document.createElement("div");
      // Sanitize before parsing to prevent XSS
      headDiv.innerHTML = DOMPurify.sanitize(scripts.head, { ADD_TAGS: ["script"], ADD_ATTR: ["src", "async", "defer"] });
      Array.from(headDiv.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const script = document.createElement("script");
          Array.from((node as Element).attributes).forEach((attr) => {
            script.setAttribute(attr.name, attr.value);
          });
          // Use textContent instead of innerHTML for script content
          script.textContent = (node as Element).textContent;
          document.head.appendChild(script);
        }
      });
    }

    if (scripts?.body) {
      const bodyDiv = document.createElement("div");
      // Sanitize before parsing to prevent XSS
      bodyDiv.innerHTML = DOMPurify.sanitize(scripts.body, { ADD_TAGS: ["script"], ADD_ATTR: ["src", "async", "defer"] });
      Array.from(bodyDiv.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const script = document.createElement("script");
          Array.from((node as Element).attributes).forEach((attr) => {
            script.setAttribute(attr.name, attr.value);
          });
          // Use textContent instead of innerHTML for script content
          script.textContent = (node as Element).textContent;
          document.body.appendChild(script);
        }
      });
    }
  }, [scripts]);

  return null;
};

export default ScriptInjector;
