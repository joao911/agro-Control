import { useEffect, useId, useState } from "react";
import {
  Button,
  Dialog,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { Controller } from "react-hook-form";
import {
  requiresBreedingFields,
  useBovinoFormValidation,
  type BovinoFormSubmit,
  type BovinoFormValues,
} from "./useBovinoFormValidation";
import { FieldLabel } from "../../../../../components/FieldLabel";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "#d1d5db",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f08c10",
    },
    "&.Mui-disabled": {
      backgroundColor: "#f1f5f9",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#1e293b",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#94a3b8",
    opacity: 1,
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
  },
};

const sexLabel: Record<string, string> = {
  femea: "Fêmea",
  macho: "Macho",
};

type ModalCreateAndUpdateProps = {
  open: boolean;
  mode: "create" | "update";
  initialValues?: Partial<BovinoFormValues>;
  onClose: () => void;
  onSubmit: (data: BovinoFormSubmit) => void;
};

const formatWeight = (value: string) => {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  if (!normalized) return "";

  const weight = Number(normalized);
  if (!Number.isFinite(weight)) return value;

  return weight.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
};

export const ModalCreateAndUpdate = ({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
}: ModalCreateAndUpdateProps) => {
  const photoInputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useBovinoFormValidation({ initialValues });

  const photo = watch("photo");
  const sex = watch("sex");
  const age = watch("age");
  const isUpdate = mode === "update";
  const showBreedingFields = requiresBreedingFields(sex, age);

  useEffect(() => {
    if (showBreedingFields) return;

    setValue("calfAge", "");
    setValue("heatDate", null);
    clearErrors(["calfAge", "heatDate"]);
  }, [showBreedingFields, setValue, clearErrors]);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const handlePhoto = (file?: File) => {
    setValue("photo", file ?? null, { shouldValidate: true });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "18px",
            overflow: "hidden",
            maxWidth: 740,
            width: "100%",
          },
        },
      }}
    >
      <form
        className="flex max-h-[90dvh] flex-col"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative shrink-0 bg-orange-100 px-6 py-5 text-white">
          <IconButton
            aria-label="Fechar"
            onClick={onClose}
            className="absolute! top-3 right-3 text-white!"
          >
            <CloseIcon />
          </IconButton>
          <h2 className="pr-10 text-2xl font-bold">
            {isUpdate ? "Atualizar Bovino" : "Cadastrar Novo Bovino"}
          </h2>
          <p className="mt-1 max-w-[620px] text-sm leading-5 text-white/90">
            {isUpdate
              ? "Atualize os dados cadastrais, a procedência e a foto do ciclo biométrico de 30 dias"
              : "Preencha os dados cadastrais, procedência e anexe a primeira foto para início do ciclo biométrico de 30 dias"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 overflow-y-auto px-6 py-6 sm:grid-cols-2">
          <div>
            <FieldLabel>Sexo *</FieldLabel>
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  size="small"
                  variant="outlined"
                  disabled={isUpdate}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  error={!!errors.sex}
                  helperText={errors.sex?.message}
                  sx={inputSx}
                  slotProps={{
                    select: {
                      displayEmpty: true,
                      renderValue: (selected) => {
                        const value = String(selected ?? "");
                        if (!value) {
                          return (
                            <span className="text-slate-400">Selecione</span>
                          );
                        }
                        return sexLabel[value] ?? value;
                      },
                    },
                  }}
                >
                  <MenuItem value="femea">Fêmea</MenuItem>
                  <MenuItem value="macho">Macho</MenuItem>
                </TextField>
              )}
            />
          </div>

          <div>
            <FieldLabel>Data da compra / entrada *</FieldLabel>
            <Controller
              name="purchaseDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  disabled={isUpdate}
                  maxDate={new Date()}
                  format="dd/MM/yyyy"
                  className="w-full"
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      error: !!errors.purchaseDate,
                      helperText: errors.purchaseDate?.message,
                      sx: inputSx,
                      onBlur: field.onBlur,
                      inputRef: field.ref,
                    },
                  }}
                />
              )}
            />
          </div>

          <div>
            <FieldLabel>Peso (kg) (opcional)</FieldLabel>
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={() => {
                    field.onChange(formatWeight(field.value));
                    field.onBlur();
                  }}
                  inputRef={field.ref}
                  placeholder="240,0"
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.weight}
                  helperText={errors.weight?.message}
                  sx={inputSx}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <span className="text-sm text-slate-400">kg</span>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </div>

          <div>
            <FieldLabel>Idade (anos) *</FieldLabel>
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  disabled={isUpdate}
                  onChange={(event) => {
                    field.onChange(
                      event.target.value.replace(/\D/g, "").slice(0, 2),
                    );
                  }}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  placeholder="3"
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.age}
                  helperText={errors.age?.message}
                  sx={inputSx}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <span className="text-sm text-slate-400">anos</span>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </div>

          {showBreedingFields && (
            <>
              <div>
                <FieldLabel>Idade da cria (anos) *</FieldLabel>
                <Controller
                  name="calfAge"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      value={field.value}
                      onChange={(event) => {
                        field.onChange(
                          event.target.value.replace(/\D/g, "").slice(0, 2),
                        );
                      }}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      placeholder="1"
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!errors.calfAge}
                      helperText={errors.calfAge?.message}
                      sx={inputSx}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <span className="text-sm text-slate-400">
                                anos
                              </span>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </div>

              <div>
                <FieldLabel>Data do cio *</FieldLabel>
                <Controller
                  name="heatDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      maxDate={new Date()}
                      format="dd/MM/yyyy"
                      className="w-full"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!errors.heatDate,
                          helperText: errors.heatDate?.message,
                          sx: inputSx,
                          onBlur: field.onBlur,
                          inputRef: field.ref,
                        },
                      }}
                    />
                  )}
                />
              </div>
            </>
          )}
          <div className="sm:col-span-2">
            <FieldLabel>Nome do bovino / animal *</FieldLabel>
            <TextField
              {...register("name")}
              disabled={isUpdate}
              placeholder="Estrela da Aliança FIV"
              variant="outlined"
              fullWidth
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={inputSx}
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>Procedência *</FieldLabel>
            <TextField
              {...register("origin")}
              placeholder="Curral de Assis"
              variant="outlined"
              fullWidth
              size="small"
              error={!!errors.origin}
              helperText={errors.origin?.message}
              sx={inputSx}
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>
              {isUpdate ? "Upload da nova foto" : "Upload da foto inicial"}
            </FieldLabel>
            <label
              htmlFor={photoInputId}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handlePhoto(event.dataTransfer.files?.[0]);
              }}
              className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-6 text-center transition-colors ${
                errors.photo
                  ? "border-red-400 bg-red-50"
                  : isDragging
                    ? "border-orange-100 bg-orange-50"
                    : "border-slate-300 bg-[#f8fafc]"
              }`}
            >
              <input
                id={photoInputId}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(event) => {
                  handlePhoto(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />

              {previewUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={previewUrl}
                    alt="Foto inicial do bovino"
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <span className="text-sm font-semibold text-orange-100">
                    {photo?.name}
                  </span>
                </div>
              ) : (
                <>
                  <PhotoCameraOutlinedIcon className="mb-2 text-orange-100!" />
                  <p className="text-sm">
                    <span className="font-semibold text-orange-100">
                      {isUpdate
                        ? "Adicione uma nova foto para comparação"
                        : "Adicione a primeira foto para comparação"}
                    </span>{" "}
                    <span className="text-slate-500">
                      periódica a cada 30 dias
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    PNG, JPG até 10MB (fotografia com identificação visível)
                  </p>
                </>
              )}
            </label>
            {errors.photo?.message && (
              <p className="mt-1 text-xs text-[#d32f2f]">
                {errors.photo.message}
              </p>
            )}
            {photo && (
              <button
                type="button"
                className="mt-2 text-sm font-semibold text-[#121063]"
                onClick={() => handlePhoto(undefined)}
              >
                Remover foto
              </button>
            )}
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>Observações adicionais (opcional)</FieldLabel>
            <TextField
              {...register("observations")}
              placeholder="Vacinações em dia, características morfológicas, anotações de manejo..."
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              error={!!errors.observations}
              helperText={errors.observations?.message}
              sx={inputSx}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <Button
            type="button"
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              color: "#334155",
              borderColor: "#cbd5e1",
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<CheckIcon />}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              backgroundColor: "#121063",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#1c1c7b",
                boxShadow: "none",
              },
            }}
          >
            Salvar
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
