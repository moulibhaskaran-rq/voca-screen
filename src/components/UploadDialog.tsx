import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, CheckCircle2, Mail, Phone, Briefcase, Award } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const candidateSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string()
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .toLowerCase(),
  phone: z.string()
    .regex(/^[\d\s\-+()]+$/, "Phone number contains invalid characters")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long"),
  position: z.string()
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position is too long"),
  seniorityLevel: z.enum(["junior", "mid", "senior", "lead", "executive"], {
    errorMap: () => ({ message: "Please select a seniority level" }),
  }),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

export const UploadDialog = ({ open, onOpenChange }: UploadDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: CandidateFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("🎉 Candidate added successfully!", {
        description: `${data.name} (${data.seniorityLevel}) is now in the pipeline`,
        duration: 4000,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add candidate", {
        description: "Please try again",
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
            <div className="p-3 bg-gradient-to-br from-primary/30 to-primary-glow/20 rounded-2xl shadow-glow-md">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            Add Candidate
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground/80">
            Complete the form to add a candidate to your recruitment pipeline
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 animate-fade-in">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem className="animate-slide-up" style={{ animationDelay: "50ms" }}>
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
                          fieldState.invalid && field.value ? "border-destructive/50" : "border-border"
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
                <FormItem className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <Mail className="w-4 h-4" />
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
                          fieldState.invalid && field.value ? "border-destructive/50" : "border-border"
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
                <FormItem className="animate-slide-up" style={{ animationDelay: "150ms" }}>
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <Phone className="w-4 h-4" />
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
                          fieldState.invalid && field.value ? "border-destructive/50" : "border-border"
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
                <FormItem className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <Briefcase className="w-4 h-4" />
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
                          fieldState.invalid && field.value ? "border-destructive/50" : "border-border"
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
                <FormItem className="animate-slide-up" style={{ animationDelay: "250ms" }}>
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <Award className="w-4 h-4" />
                    Seniority Level
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className={`transition-all duration-300 focus:ring-2 focus:ring-primary/50 border-2 ${
                        fieldState.invalid && field.value ? "border-destructive/50" : "border-border"
                      } hover:border-primary/50`}>
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
                      <SelectItem value="mid">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          Mid-Level
                        </span>
                      </SelectItem>
                      <SelectItem value="senior">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          Senior
                        </span>
                      </SelectItem>
                      <SelectItem value="lead">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500" />
                          Lead
                        </span>
                      </SelectItem>
                      <SelectItem value="executive">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          Executive
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="animate-slide-up text-xs" />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 animate-slide-up border-t border-border/50 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                disabled={isSubmitting}
                className="hover:scale-105 transition-all duration-200 border-2"
              >
                Cancel
              </Button>
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
