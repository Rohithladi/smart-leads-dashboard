import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { getApiErrorMessage } from "../../api/http";
import { authApi } from "../../api/auth.api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setSession(data.user, data.token);
      navigate("/leads", { replace: true });
    }
  });

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white/95 p-7 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Welcome back</h2>
      <p className="mt-2 text-sm text-slate-600">Sign in to continue managing leads.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {loginMutation.isError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {getApiErrorMessage(loginMutation.error)}
          </p>
        ) : null}

        <Button className="w-full" type="submit" isLoading={loginMutation.isPending} icon={<LogIn className="h-4 w-4" aria-hidden="true" />}>
          Sign in
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        New here?{" "}
        <Link className="font-medium text-brand-700 hover:text-brand-600" to="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
};
