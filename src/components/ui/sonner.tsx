import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:glass group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-primary/30 group-[.toaster]:shadow-glass-lg group-[.toaster]:rounded-2xl group-[.toaster]:text-base group-[.toaster]:font-semibold group-[.toaster]:px-6 group-[.toaster]:py-4 group-[.toaster]:gap-8 group-[.toaster]:justify-between",
          icon: "group-[.toast]:shrink-0",
          content: "group-[.toast]:flex group-[.toast]:flex-col group-[.toast]:gap-0 group-[.toast]:flex-1 group-[.toast]:ml-3",
          title: "group-[.toast]:font-semibold group-[.toast]:text-base group-[.toast]:leading-tight",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:font-medium group-[.toast]:text-sm group-[.toast]:mt-1 group-[.toast]:leading-snug",
          actionButton: "group-[.toast]:bg-gradient-to-r group-[.toast]:from-primary group-[.toast]:to-cyan group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:font-semibold",
          cancelButton: "group-[.toast]:bg-muted/50 group-[.toast]:text-foreground group-[.toast]:rounded-xl group-[.toast]:backdrop-blur-sm",
          closeButton: "group-[.toast]:absolute group-[.toast]:!-right-2 group-[.toast]:!-top-2 group-[.toast]:!left-auto group-[.toast]:bg-foreground group-[.toast]:text-background group-[.toast]:hover:bg-foreground/90 group-[.toast]:rounded-full group-[.toast]:w-6 group-[.toast]:h-6 group-[.toast]:flex group-[.toast]:items-center group-[.toast]:justify-center group-[.toast]:border-2 group-[.toast]:border-background",
          success: "group-[.toaster]:border-success/50 group-[.toaster]:shadow-success-glow",
          error: "group-[.toaster]:border-destructive/50 group-[.toaster]:shadow-lg",
          warning: "group-[.toaster]:border-warning/50",
          info: "group-[.toaster]:border-cyan/50 group-[.toaster]:shadow-cyan-glow",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
