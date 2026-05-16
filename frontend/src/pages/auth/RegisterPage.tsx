import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { authApi } from "../../api/auth.api";
import { getApiErrorMessage } from "../../api/http";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Use at least one uppercase letter")
    .regex(/[a-z]/, "Use at least one lowercase letter")
    .regex(/[0-9]/, "Use at least one number")
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setSession(data.user, data.token);
      navigate("/leads", { replace: true });
    }
  });

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white/95 p-7 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Create account</h2>
      <p className="mt-2 text-sm text-slate-600">New accounts start with sales access.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => registerMutation.mutate(values))}>
        <Input label="Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        {registerMutation.isError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {getApiErrorMessage(registerMutation.error)}
          </p>
        ) : null}

        <Button className="w-full" type="submit" isLoading={registerMutation.isPending} icon={<UserPlus className="h-4 w-4" aria-hidden="true" />}>
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link className="font-medium text-brand-700 hover:text-brand-600" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
};
