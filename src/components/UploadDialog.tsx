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
  Upload,
  FileText,
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
import * as pdfjsLib from "pdfjs-dist";

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

// Set up PDF.js worker - using local worker file to avoid CORS issues
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export const UploadDialog = ({ open, onOpenChange, onCandidateAdded }: UploadDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
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
    setUploadedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const parseResumeData = (text: string) => {
    const data: any = {};

    // Extract Email (matches standard email format)
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const emailMatches = text.match(emailRegex);
    if (emailMatches && emailMatches.length > 0) {
      data.email = emailMatches[0].toLowerCase();
    }

    // Extract Phone (matches various phone formats including international)
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{0,4}/g;
    const phoneMatches = text.match(phoneRegex);
    if (phoneMatches) {
      // Filter out numbers that are too short (likely not phone numbers)
      const validPhones = phoneMatches.filter(phone => phone.replace(/\D/g, '').length >= 10);
      if (validPhones.length > 0) {
        data.phone = validPhones[0];
      }
    }

    // Extract Name - Multiple strategies
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    // Strategy 1: Look for lines with 2-3 capitalized words (typical name format)
    for (let i = 0; i < Math.min(15, lines.length); i++) {
      const line = lines[i].trim();

      // Match names like "John Doe", "John Smith Doe", etc.
      const namePattern = /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})$/;
      const match = line.match(namePattern);

      if (match) {
        const potentialName = match[1].trim();
        const words = potentialName.split(/\s+/);

        // Validate: 2-3 words, each 2+ chars, total length reasonable
        if (words.length >= 2 && words.length <= 3 &&
            words.every(w => w.length >= 2) &&
            potentialName.length >= 5 && potentialName.length <= 40 &&
            !potentialName.toLowerCase().includes('resume') &&
            !potentialName.toLowerCase().includes('curriculum') &&
            !potentialName.toLowerCase().includes('vitae')) {
          data.name = potentialName;
          break;
        }
      }
    }

    // Strategy 2: If no name found, look for name after common labels
    if (!data.name) {
      const nameLabels = ['name:', 'candidate:', 'applicant:'];
      for (const label of nameLabels) {
        const regex = new RegExp(`${label}\\s*([A-Z][a-z]+(?:\\s+[A-Z][a-z]+){1,2})`, 'i');
        const match = text.match(regex);
        if (match && match[1]) {
          data.name = match[1].trim();
          break;
        }
      }
    }

    // Extract Position/Job Title with better cleaning
    const jobTitles = [
      'Software Engineer', 'Software Developer', 'Web Developer', 'Mobile Developer',
      'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Full-Stack Developer',
      'UI/UX Designer', 'UX Designer', 'UI Designer', 'Product Designer', 'Graphic Designer',
      'Data Scientist', 'Data Analyst', 'Data Engineer', 'Machine Learning Engineer',
      'DevOps Engineer', 'Cloud Engineer', 'System Administrator', 'Site Reliability Engineer',
      'Product Manager', 'Project Manager', 'Program Manager', 'Technical Lead', 'Team Lead',
      'QA Engineer', 'Test Engineer', 'Quality Assurance Engineer', 'Quality Assurance Analyst',
      'Business Analyst', 'System Analyst', 'Financial Analyst',
      'Solutions Architect', 'Software Architect', 'Technical Architect', 'Cloud Architect',
      'Scrum Master', 'Agile Coach',
      'Developer', 'Engineer', 'Designer', 'Manager', 'Analyst', 'Consultant', 'Specialist'
    ];

    // Sort by length (longest first) to match more specific titles first
    jobTitles.sort((a, b) => b.length - a.length);

    // Look for position in multiple ways
    for (const title of jobTitles) {
      const regex = new RegExp(`(${title})`, 'i');
      const match = text.match(regex);

      if (match) {
        // Try to get the line containing this title
        const titleLines = text.split('\n').filter(line =>
          new RegExp(title, 'i').test(line)
        );

        if (titleLines.length > 0) {
          // Clean up the first matching line
          let position = titleLines[0].trim();

          // Remove common prefixes/suffixes
          position = position.replace(/^(current\s+role|position|title|role)[:|\s-]+/i, '');
          position = position.replace(/\s*[|]\s*.*/g, ''); // Remove everything after |
          position = position.replace(/\s*[-]\s*\d{4}.*/g, ''); // Remove date ranges
          position = position.replace(/\s+at\s+.*/i, ''); // Remove company name after "at"
          position = position.replace(/[,]\s*.*/g, ''); // Remove everything after comma

          // Limit length and clean
          position = position.substring(0, 50).trim();

          // Only use if it's reasonable length and contains the matched title
          if (position.length >= 5 && position.length <= 50 &&
              new RegExp(title, 'i').test(position)) {
            data.position = position;
            break;
          }
        }
      }
    }

    // Determine Seniority Level
    const textLower = text.toLowerCase();
    const seniorKeywords = ['senior', 'sr.', 'lead', 'principal', 'staff', 'chief', 'head of'];
    const midKeywords = ['mid-level', 'mid level', 'intermediate', 'experienced'];
    const juniorKeywords = ['junior', 'jr.', 'entry', 'associate', 'trainee', 'intern', 'graduate'];

    if (seniorKeywords.some(keyword => textLower.includes(keyword))) {
      data.seniorityLevel = 'senior';
    } else if (midKeywords.some(keyword => textLower.includes(keyword))) {
      data.seniorityLevel = 'mid-senior';
    } else if (juniorKeywords.some(keyword => textLower.includes(keyword))) {
      data.seniorityLevel = 'junior';
    }

    return data;
  };

  const handleResumeUpload = async (file: File | undefined) => {
    if (!file) {
      setUploadedFileName("");
      return;
    }

    setUploadedFileName(file.name);
    setIsParsing(true);

    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);

      if (!text || text.trim().length === 0) {
        throw new Error('No text could be extracted from PDF');
      }

      // Parse resume data from text
      const parsedData = parseResumeData(text);

      // Auto-fill form fields with parsed data
      let filledCount = 0;

      if (parsedData.name) {
        form.setValue('name', parsedData.name, { shouldValidate: true });
        filledCount++;
      }
      if (parsedData.email) {
        form.setValue('email', parsedData.email, { shouldValidate: true });
        filledCount++;
      }
      if (parsedData.phone) {
        form.setValue('phone', parsedData.phone, { shouldValidate: true });
        filledCount++;
      }
      if (parsedData.position) {
        form.setValue('position', parsedData.position, { shouldValidate: true });
        filledCount++;
      }
      if (parsedData.seniorityLevel) {
        form.setValue('seniorityLevel', parsedData.seniorityLevel, { shouldValidate: true });
        filledCount++;
      }

      if (filledCount > 0) {
        toast.success('Resume parsed successfully!', {
          description: `${filledCount} field${filledCount > 1 ? 's' : ''} auto-filled. You can edit them if needed.`,
          duration: 4000,
          closeButton: true,
        });
      } else {
        toast.info('Resume uploaded', {
          description: 'No data could be extracted. Please fill fields manually.',
          duration: 4000,
          closeButton: true,
        });
      }
    } catch (error) {
      console.error('Resume parsing failed:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to parse resume', {
        description: 'Please fill the fields manually.',
        duration: 4000,
        closeButton: true,
      });
    } finally {
      setIsParsing(false);
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
        closeButton: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto animate-pop glass backdrop-blur-xl border border-white/20 shadow-glass-xl rounded-3xl">
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
            {/* Resume Upload Field - Full Width */}
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem
                  className="animate-slide-up"
                  style={{ animationDelay: "50ms" }}
                >
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <FileText className="w-4 h-4 text-foreground" />
                    Resume / Portfolio
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-4 transition-all duration-300 bg-muted/30 hover:bg-muted/50">
                        <Input
                          type="file"
                          accept="application/pdf"
                          disabled={isSubmitting || isParsing}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            field.onChange(file);
                            handleResumeUpload(file);
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={(element) => {
                            field.ref(element);
                            fileInputRef.current = element;
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-center gap-3 text-center pointer-events-none">
                          {uploadedFileName ? (
                            <>
                              <FileText className="w-6 h-6 text-success flex-shrink-0" />
                              <div className="flex-1 text-left">
                                <p className="text-sm font-semibold text-foreground truncate">{uploadedFileName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {isParsing ? 'Parsing resume...' : 'Click to change file'}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 text-left">
                                <p className="text-sm font-semibold text-foreground">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PDF up to 5MB
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Upload your resume and we'll auto-fill the form fields. You can edit them manually if needed.
                  </FormDescription>
                  <FormMessage className="animate-slide-up text-xs" />
                </FormItem>
              )}
            />

            {/* Two Column Grid for Other Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem
                    className="animate-slide-up"
                    style={{ animationDelay: "100ms" }}
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
                    style={{ animationDelay: "150ms" }}
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
                    style={{ animationDelay: "200ms" }}
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
                    style={{ animationDelay: "250ms" }}
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
                    style={{ animationDelay: "300ms" }}
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
            </div>

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
