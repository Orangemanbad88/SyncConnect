import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
    return <Redirect to="/" />;
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
    <div className="min-h-screen flex flex-col bg-black text-white font-georgia">
      {/* Header with SYNC logo */}
      <div className="w-full flex justify-center pt-10 pb-6">
        <SyncLogo className="w-60 h-auto" />
      </div>
      
      {/* Main content - single column */}
      <div className="flex-1 flex flex-col items-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Short description */}
          <div className="text-center mb-10">
            <h2 
              className="text-white auth-text italic text-2xl md:text-3xl font-bold animate-pulse-slow"
              style={{ 
                textShadow: `
                  0 0 1px rgba(255, 255, 255, 1),
                  0 0 5px rgba(173, 216, 230, 1),
                  0 0 10px rgba(135, 206, 250, 0.8),
                  0 0 15px rgba(100, 149, 237, 0.7),
                  0 0 20px rgba(65, 105, 225, 0.6),
                  0 0 25px rgba(0, 191, 255, 0.5)
                `,
                letterSpacing: '0.075em',
                color: 'rgba(240, 248, 255, 0.95)'
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
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1 auth-text text-lg">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex-1 auth-text text-lg">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
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
                        <FormLabel className="text-base auth-text">Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
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
                        <FormLabel className="text-base auth-text">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full text-lg py-6 auth-button"
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
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
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
                          <FormLabel className="text-base auth-text">Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
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
                          <FormLabel className="text-base auth-text">Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
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
                          <FormLabel className="text-base auth-text">Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm Password"
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
                          <FormLabel className="text-base auth-text">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full Name" {...field} />
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
                          <FormLabel className="text-base auth-text">Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Age"
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
                    className="w-full text-lg py-6 auth-button"
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
            </TabsContent>
          </Tabs>
          
          {/* Features as bullet points */}
          <div className="mt-12 bg-blue-900/30 rounded-xl p-6">
            <h3 className="text-2xl auth-heading mb-4 text-center">Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white font-bold">•</span>
                </div>
                <p className="auth-text">Find people nearby using location-based matching</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white font-bold">•</span>
                </div>
                <p className="auth-text">Connect through 2-minute video chats</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white font-bold">•</span>
                </div>
                <p className="auth-text">Match instantly with compatible users</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white font-bold">•</span>
                </div>
                <p className="auth-text">Roll the dice for randomized matching</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white font-bold">•</span>
                </div>
                <p className="auth-text">Message your matches instantly</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}