import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  CheckCircle2,
  Mail,
  Phone,
  Briefcase,
  Award,
  Paperclip,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { addCandidate, AddCandidateError } from "@/services/candidate";
import { ApiError } from "@/services/api";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCandidateAdded?: () => void;
}

const candidateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .toLowerCase(),
  phone: z
    .string()
    .regex(/^[\d\s\-+()]+$/, "Phone number contains invalid characters")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long"),
  position: z
    .string()
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position is too long"),
  seniorityLevel: z.enum(["junior", "mid-senior", "senior"], {
    errorMap: () => ({ message: "Please select a seniority level" }),
  }),
  resume: z
    .instanceof(File, { message: "Please upload a valid PDF file" })
    .refine(
      (file) => file.type === "application/pdf",
      "Only PDF files are allowed"
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, "File must be 5MB or less"),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

export const UploadDialog = ({ open, onOpenChange, onCandidateAdded }: UploadDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      seniorityLevel: undefined,
    },
    mode: "onChange",
  });

  const resetForm = () => {
    form.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          const base64 = result.split(",")[1] ?? "";
          resolve(base64);
        } else {
          reject(new Error("Could not read file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: CandidateFormValues) => {
    setIsSubmitting(true);
    try {
      const resumeBase64 = data.resume ? await fileToBase64(data.resume) : undefined;

      const candidate = await addCandidate(
        data.name,
        data.email,
        data.phone,
        data.position,
        data.seniorityLevel,
        resumeBase64
      );

      // Use the API message for the success toast
      const successMessage = candidate.apiMessage || "Candidate added successfully!";
      toast.success(successMessage, {
        description: `${candidate.name} has been added to the pipeline`,
        duration: 3000,
        closeButton: true,
        icon: (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center border-2 border-success/30">
            <UserPlus className="w-5 h-5 text-success" strokeWidth={2.5} />
          </div>
        ),
      });
      resetForm();
      onOpenChange(false);
      // Refresh candidates list after adding
      if (onCandidateAdded) {
        onCandidateAdded();
      }
    } catch (error) {
      let errorMessage = "Please try again";

      if (error instanceof AddCandidateError) {
        errorMessage = error.apiMessage;
      } else if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error("Failed to add candidate", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] animate-pop glass backdrop-blur-xl border border-white/20 shadow-glass-xl rounded-3xl">
        <DialogHeader className="animate-slide-down">
          <DialogTitle className="text-3xl font-bold flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-2xl">
              <UserPlus className="w-6 h-6 text-foreground" />
            </div>
            Add Candidate
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground/80">
            Complete the form to add a candidate to your recruitment pipeline
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 animate-fade-in"
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem
                  className="animate-slide-up"
                  style={{ animationDelay: "50ms" }}
                >
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <span>Full Name</span>
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        placeholder="John Doe"
                        {...field}
                        disabled={isSubmitting}
                        className={`transition-all duration-300 focus:ring-2 focus:ring-primary/50 border-2 ${
                          fieldState.invalid && field.value
                            ? "border-destructive/50"
                            : "border-border"
                        } group-hover:border-primary/50`}
                      />
                      {!fieldState.invalid && field.value && (
                        <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success animate-pop" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="animate-slide-up text-xs" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem
                  className="animate-slide-up"
                  style={{ animationDelay: "100ms" }}
                >
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <Mail className="w-4 h-4 text-foreground" />
                    Email Address
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        disabled={isSubmitting}
                        className={`transition-all duration-300 focus:ring-2 focus:ring-primary/50 border-2 ${
                          fieldState.invalid && field.value
                            ? "border-destructive/50"
                            : "border-border"
                        } group-hover:border-primary/50`}
                      />
                      {!fieldState.invalid && field.value && (
                        <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success animate-pop" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="animate-slide-up text-xs" />
                </FormItem>
              )}
            />

            {/* Phone Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem
                  className="animate-slide-up"
                  style={{ animationDelay: "150ms" }}
                >
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <Phone className="w-4 h-4 text-foreground" />
                    Phone Number
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...field}
                        disabled={isSubmitting}
                        className={`transition-all duration-300 focus:ring-2 focus:ring-primary/50 border-2 ${
                          fieldState.invalid && field.value
                            ? "border-destructive/50"
                            : "border-border"
                        } group-hover:border-primary/50`}
                      />
                      {!fieldState.invalid && field.value && (
                        <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success animate-pop" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="animate-slide-up text-xs" />
                </FormItem>
              )}
            />

            {/* Position Field */}
            <FormField
              control={form.control}
              name="position"
              render={({ field, fieldState }) => (
                <FormItem
                  className="animate-slide-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <Briefcase className="w-4 h-4 text-foreground" />
                    Position
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        placeholder="Software Engineer"
                        {...field}
                        disabled={isSubmitting}
                        className={`transition-all duration-300 focus:ring-2 focus:ring-primary/50 border-2 ${
                          fieldState.invalid && field.value
                            ? "border-destructive/50"
                            : "border-border"
                        } group-hover:border-primary/50`}
                      />
                      {!fieldState.invalid && field.value && (
                        <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success animate-pop" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="animate-slide-up text-xs" />
                </FormItem>
              )}
            />

            {/* Seniority Level Field */}
            <FormField
              control={form.control}
              name="seniorityLevel"
              render={({ field, fieldState }) => (
                <FormItem
                  className="animate-slide-up"
                  style={{ animationDelay: "250ms" }}
                >
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <Award className="w-4 h-4 text-foreground" />
                    Seniority Level
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`transition-all duration-300 focus:ring-2 focus:ring-primary/50 border-2 ${
                          fieldState.invalid && field.value
                            ? "border-destructive/50"
                            : "border-border"
                        } hover:border-primary/50`}
                      >
                        <SelectValue placeholder="Select seniority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="animate-expand">
                      <SelectItem value="junior">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          Junior
                        </span>
                      </SelectItem>
                      <SelectItem value="mid-senior">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          Mid-Senior
                        </span>
                      </SelectItem>
                      <SelectItem value="senior">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          Senior
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="animate-slide-up text-xs" />
                </FormItem>
              )}
            />

            {/* Resume Upload Field */}
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem
                  className="animate-slide-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <Paperclip className="w-4 h-4" />
                    Resume / Portfolio
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        type="file"
                        accept="application/pdf"
                        disabled={isSubmitting}
                        onChange={(event) =>
                          field.onChange(event.target.files?.[0] ?? undefined)
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={(element) => {
                          field.ref(element);
                          fileInputRef.current = element;
                        }}
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 border-2 border-border hover:border-primary/50 file:bg-transparent file:border-0 file:font-medium file:text-primary"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Upload a single PDF up to 5MB. File will be attached to the
                    candidate profile.
                  </FormDescription>
                  <FormMessage className="animate-slide-up text-xs" />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 animate-slide-up border-t border-border/50 mt-6">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer h-10 px-4 py-2 bg-background text-foreground border-2 border-border"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                {isSubmitting ? "Adding..." : "Add Candidate"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
