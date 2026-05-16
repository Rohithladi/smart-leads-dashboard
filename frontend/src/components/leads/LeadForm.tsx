import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { CreateLeadPayload, Lead, LeadStatus, UpdateLeadPayload } from "../../types/lead.types";
import { leadSources, leadStatuses } from "../../types/lead.types";
import { sourceOptions, statusOptions } from "../../utils/constants";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  status: z.enum(leadStatuses),
  source: z.enum(leadSources)
});

type LeadFormData = z.infer<typeof leadFormSchema>;

type LeadFormProps = {
  lead?: Lead;
  role: "admin" | "sales";
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: CreateLeadPayload | UpdateLeadPayload) => void;
};

export const LeadForm = ({ isSubmitting, lead, onCancel, onSubmit, role }: LeadFormProps) => {
  const salesMode = role === "sales";

  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: lead?.name ?? "",
      email: lead?.email ?? "",
      status: lead?.status ?? "new",
      source: lead?.source ?? "website"
    }
  });

  const submitForm = (values: LeadFormData): void => {
    if (salesMode) {
      onSubmit({ status: values.status });
      return;
    }

    onSubmit(values);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submitForm)}>
      {!salesMode ? (
        <>
          <Input label="Name" error={errors.name?.message} {...register("name")} />
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Select
            label="Source"
            options={sourceOptions}
            error={errors.source?.message}
            {...register("source")}
          />
        </>
      ) : null}

      <Select
        label="Status"
        options={statusOptions as Array<{ label: string; value: LeadStatus }>}
        error={errors.status?.message}
        {...register("status")}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
};
