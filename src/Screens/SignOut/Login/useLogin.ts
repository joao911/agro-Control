import { z } from "zod";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseUrl } from "../../../api";
import { userStore } from "../../../store/user";

export const useLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = userStore();

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
    try {
      setLoading(true);
      const response = await baseUrl.post("/api/v1/auth/login", {
        username: email,
        password: password,
      });
      setUser({
        access_token: response.data.access_token,
        user: response.data.user,
      });
      navigate("/home");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
