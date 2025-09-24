import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Pwned Passwords k-anonymity check utilities
function ab2hex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

async function sha1(text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  return ab2hex(hashBuffer);
}

async function checkPasswordPwned(password: string): Promise<number> {
  const hash = await sha1(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);
  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { "Add-Padding": "true" },
  });
  if (!res.ok) throw new Error("HIBP request failed");
  const body = await res.text();
  for (const line of body.split("\n")) {
    const [hashSuffix, countStr] = line.trim().split(":");
    if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
      const count = parseInt(countStr, 10);
      return Number.isNaN(count) ? 0 : count;
    }
  }
  return 0;
}

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const loginCaptchaRef = useRef<ReCAPTCHA>(null);
  const signupCaptchaRef = useRef<ReCAPTCHA>(null);

  // reCAPTCHA site key (6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI is the test key)
  const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
  
  // CAPTCHA is optional - if Supabase CAPTCHA isn't configured, we skip it
  const CAPTCHA_ENABLED = false; // Set to true when Supabase CAPTCHA is configured

  // Input validation schema
  const credentialsSchema = z.object({
    email: z
      .string()
      .trim()
      .email({ message: "Please enter a valid email address" })
      .max(255, { message: "Email must be less than 255 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(128, { message: "Password must be less than 128 characters" }),
  });

  // SEO basics
  useEffect(() => {
    document.title = "Login or Sign Up | NextCare Global Services";
    const desc = "Secure login and signup for NextCare Global Services client portal.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);

  // Redirect authenticated users to home
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Defer navigation per best practices
        setTimeout(() => navigate("/"), 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) navigate("/");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    const result = credentialsSchema.safeParse({ email, password });
    if (!result.success) {
      toast({ title: "Invalid input", description: result.error.issues[0]?.message ?? "Please correct the form fields." });
      return;
    }

    // Get CAPTCHA token (optional if not enabled)
    const captchaToken = CAPTCHA_ENABLED ? loginCaptchaRef.current?.getValue() : null;
    if (CAPTCHA_ENABLED && !captchaToken) {
      toast({ title: "CAPTCHA required", description: "Please complete the CAPTCHA verification." });
      return;
    }
    
    setLoading(true);
    const authOptions = CAPTCHA_ENABLED && captchaToken ? { captchaToken } : {};
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password,
      options: authOptions
    });
    setLoading(false);
    
    if (error) {
      toast({ title: "Login failed", description: error.message });
      if (CAPTCHA_ENABLED) loginCaptchaRef.current?.reset();
    } else {
      toast({ title: "Welcome back" });
      navigate("/");
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    const result = credentialsSchema.safeParse({ email, password });
    if (!result.success) {
      toast({ title: "Invalid input", description: result.error.issues[0]?.message ?? "Please correct the form fields." });
      return;
    }

    // Get CAPTCHA token (optional if not enabled)
    const captchaToken = CAPTCHA_ENABLED ? signupCaptchaRef.current?.getValue() : null;
    if (CAPTCHA_ENABLED && !captchaToken) {
      toast({ title: "CAPTCHA required", description: "Please complete the CAPTCHA verification." });
      return;
    }

    // Block breached passwords using Have I Been Pwned k-anonymity check
    try {
      const breachCount = await checkPasswordPwned(password);
      if (breachCount > 0) {
        toast({
          title: "Choose a safer password",
          description: `This password appeared in ${breachCount.toLocaleString()} breaches. Please use a unique, strong password.`,
        });
        return;
      }
    } catch {
      // If the check fails, we won't block signup; continue gracefully
    }

    setLoading(true);
    
    // Ensure redirect URL is reasonable length to prevent JSONB errors
    const baseUrl = window.location.origin;
    const redirectUrl = baseUrl.length > 200 ? baseUrl.substring(0, 200) : `${baseUrl}/`;
    
    const authOptions = {
      emailRedirectTo: redirectUrl,
      ...(CAPTCHA_ENABLED && captchaToken ? { captchaToken } : {})
    };
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: authOptions
      });
      
      if (error) {
        console.error('Signup error:', error);
        
        // Handle specific database errors
        if (error.message?.includes('string too long') || error.message?.includes('jsonb')) {
          toast({ 
            title: "Signup temporarily unavailable", 
            description: "Please try again in a few moments or contact support if the issue persists." 
          });
        } else {
          toast({ title: "Signup failed", description: error.message });
        }
        
        if (CAPTCHA_ENABLED) signupCaptchaRef.current?.reset();
      } else {
        toast({
          title: "Check your email",
          description: "We sent you a confirmation link to finish signing up."
        });
      }
    } catch (unexpectedError) {
      console.error('Unexpected signup error:', unexpectedError);
      toast({ 
        title: "Signup error", 
        description: "An unexpected error occurred. Please try again." 
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="max-w-md mx-auto bg-card border border-border rounded-xl p-6 shadow-card">
          <h1 className="text-2xl font-bold mb-6 text-foreground">Access your account</h1>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" autoComplete="current-password" />
                </div>
                {CAPTCHA_ENABLED && (
                  <div className="space-y-2">
                    <ReCAPTCHA
                      ref={loginCaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      theme="light"
                    />
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait..." : "Log in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input id="password-signup" name="password" type="password" autoComplete="new-password" />
                </div>
                {CAPTCHA_ENABLED && (
                  <div className="space-y-2">
                    <ReCAPTCHA
                      ref={signupCaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      theme="light"
                    />
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait..." : "Create account"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  By creating an account you agree to our terms and privacy policy.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
};

export default Auth;
