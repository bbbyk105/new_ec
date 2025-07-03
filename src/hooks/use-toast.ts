// hooks/use-toast.ts
import { toast as sonnerToast } from "sonner";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

export const useToast = () => {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    const message = description || title || "";
    const fullMessage =
      title && description ? `${title}: ${description}` : message;

    switch (variant) {
      case "destructive":
        sonnerToast.error(fullMessage);
        break;
      case "success":
        sonnerToast.success(fullMessage);
        break;
      default:
        sonnerToast(fullMessage);
        break;
    }
  };

  return { toast };
};
