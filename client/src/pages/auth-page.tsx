import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { COLOR_SCHEMES } from "@/hooks/useAmbientColor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import SyncLogo from "@/components/SyncLogo";
import { insertUserSchema } from "@shared/schema";

// Form schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema
  .pick({
    username: true,
    email: true,
    password: true,
    fullName: true,
    age: true,
  })
  .extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    job: z.string().optional(),
    bio: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/home" />;
  }

  // Login form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form setup
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      age: undefined,
      job: "",
      bio: "",
    },
  });

  // Form submission handlers
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    // Remove confirmPassword as it's not part of the API schema
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };

  return (
    <div
      className="min-h-screen flex flex-col text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 40%, #252A33 70%, #1A1D23 100%)',
      }}>

      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(201, 169, 98, 0.08) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}
      />

      {/* Header with SYNC logo */}
      <div className="w-full flex justify-center pt-10 pb-6 relative z-10">
        <SyncLogo className="w-52 h-auto" />
      </div>

      {/* Main content - single column */}
      <div className="flex-1 flex flex-col items-center px-4 pb-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Short description */}
          <div className="text-center mb-10">
            <h2
              className="text-2xl md:text-3xl"
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: '600',
                letterSpacing: '0.1em',
                color: '#C9A962',
                textShadow: '0 0 20px rgba(201, 169, 98, 0.3)'
              }}
            >
              Everything is Connected
            </h2>
          </div>

          {/* Auth tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mb-8"
          >
            <TabsList className="w-full mb-6 bg-[#1A1D23] border border-[#2D3139]">
              <TabsTrigger
                value="login"
                className="flex-1 text-base data-[state=active]:bg-[#C9A962] data-[state=active]:text-[#0D0F12]"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: '600' }}
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1 text-base data-[state=active]:bg-[#C9A962] data-[state=active]:text-[#0D0F12]"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: '600' }}
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="bg-[#151820] rounded-xl p-6 border border-[#2D3139] shadow-lg">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="space-y-5"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-[#9CA3AF]" style={{ fontFamily: "'Barlow', sans-serif" }}>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Username"
                              className="rounded-md bg-[#1A1D23] border-[#2D3139] text-[#E8E4DF] placeholder:text-[#4D5565]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-[#9CA3AF]" style={{ fontFamily: "'Barlow', sans-serif" }}>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              className="rounded-md bg-[#1A1D23] border-[#2D3139] text-[#E8E4DF] placeholder:text-[#4D5565]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full text-base py-5 rounded-md"
                      style={{
                        background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 50%, #C9A962 100%)',
                        color: '#0D0F12',
                        fontFamily: "'Cinzel', serif",
                        fontWeight: '700',
                        letterSpacing: '0.1em'
                      }}
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <div className="bg-[#151820] rounded-xl p-6 border border-[#2D3139] shadow-lg">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="space-y-5"
                  >
                    <div className="space-y-5">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-[#9CA3AF]" style={{ fontFamily: "'Barlow', sans-serif" }}>Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Username"
                                className="rounded-md bg-[#1A1D23] border-[#2D3139] text-[#E8E4DF] placeholder:text-[#4D5565]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-[#9CA3AF]" style={{ fontFamily: "'Barlow', sans-serif" }}>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                className="rounded-md bg-[#1A1D23] border-[#2D3139] text-[#E8E4DF] placeholder:text-[#4D5565]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-[#9CA3AF]" style={{ fontFamily: "'Barlow', sans-serif" }}>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Password"
                                className="rounded-md bg-[#1A1D23] border-[#2D3139] text-[#E8E4DF] placeholder:text-[#4D5565]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-[#9CA3AF]" style={{ fontFamily: "'Barlow', sans-serif" }}>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm Password"
                                className="rounded-md bg-[#1A1D23] border-[#2D3139] text-[#E8E4DF] placeholder:text-[#4D5565]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-[#9CA3AF]" style={{ fontFamily: "'Barlow', sans-serif" }}>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Full Name"
                                className="rounded-md bg-[#1A1D23] border-[#2D3139] text-[#E8E4DF] placeholder:text-[#4D5565]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-[#9CA3AF]" style={{ fontFamily: "'Barlow', sans-serif" }}>Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Age"
                                className="rounded-md bg-[#1A1D23] border-[#2D3139] text-[#E8E4DF] placeholder:text-[#4D5565]"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined;
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full text-base py-5 rounded-md"
                      style={{
                        background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 50%, #C9A962 100%)',
                        color: '#0D0F12',
                        fontFamily: "'Cinzel', serif",
                        fontWeight: '700',
                        letterSpacing: '0.1em'
                      }}
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>

          {/* Features section */}
          <div className="mt-10 bg-[#151820] rounded-xl p-6 border border-[#2D3139]">
            <h3
              className="text-xl mb-5 text-center"
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: '600',
                color: '#C9A962',
                letterSpacing: '0.1em'
              }}
            >
              Features
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C9A962] mr-3 mt-2" />
                <p className="text-[#9CA3AF] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>Find people nearby using location-based matching</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C9A962] mr-3 mt-2" />
                <p className="text-[#9CA3AF] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>Connect through 2-minute video chats</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C9A962] mr-3 mt-2" />
                <p className="text-[#9CA3AF] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>Match instantly with compatible users</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C9A962] mr-3 mt-2" />
                <p className="text-[#9CA3AF] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>Roll the dice for randomized matching</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C9A962] mr-3 mt-2" />
                <p className="text-[#9CA3AF] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>Message your matches instantly</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}