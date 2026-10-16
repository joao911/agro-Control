import clsx from "clsx";
import { Controller } from "react-hook-form";
import MailIcon from "@mui/icons-material/Mail";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import { useLogin } from "./useLogin";
import { FieldLabel } from "../../../components/FieldLabel";

export const Login = () => {
  const {
    errors,
    loading,
    control,
    onSubmit,

    showPassword,
    handleSubmit,
    setShowPassword,
  } = useLogin();
  return (
    <div className="flex flex-col ">
      <div className="flex gap-2 items-center justify-center">
        <h1 className="font-bold text-2xl text-black">
          <span className="font-bold text-2xl text-orange-500">Agro </span>{" "}
          Control
        </h1>
      </div>

      <span className="text-sm  text-gray-600 mt-4 text-center">
        Sistema de acompanhamento bovino
      </span>
      <span className="text-sm  text-gray-600 text-center">
        Entre com seu login e senha para gerenciar seus bovinos
      </span>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4"
      >
        <div className="h-24">
          <FieldLabel>Email *</FieldLabel>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur, ref } }) => (
              <TextField
                variant="outlined"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </div>
        <div className="h-24">
          <FieldLabel>Senha *</FieldLabel>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur, ref } }) => (
              <TextField
                fullWidth
                variant="outlined"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputRef={ref}
                error={!!errors.password}
                helperText={errors.password?.message}
                type={showPassword ? "text" : "password"}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? "Ocultar senha" : "Mostrar senha"
                          }
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <HttpsOutlinedIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </div>

        <Button
          variant="contained"
          className={clsx("bg-blue-100! capitalize!", {
            "opacity-50 cursor-not-allowed": loading,
          })}
          type="submit"
          disabled={loading}
        >
          <CircularProgress
            color="inherit"
            size={20}
            thickness={2}
            sx={{ mr: 1 }}
            hidden={!loading}
          />
          Entrar
        </Button>
      </form>
    </div>
  );
};
