import { z } from "zod";
import { size } from "lodash";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

export const useLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loginSchema = z.object({
    email: z.string().min(1, "Login obrigatório").email("E-mail inválido"),
    password: z.string().min(1, "Senha obrigatória"),
  });
  type LoginFormData = z.infer<typeof loginSchema>;
  const {
    handleSubmit,

    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();

    console.log(email, password);
  };
  return {
    errors,
    loading,
    control,
    onSubmit,
    navigate,
    showPassword,
    handleSubmit,
    setShowPassword,
  };
};
