import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export type BovinoSex = "macho" | "femea";

const parseWeight = (value: string) =>
  Number(value.trim().replace(/\./g, "").replace(",", "."));

const isAcceptedPhoto = (file: File) => {
  if (ACCEPTED_PHOTO_TYPES.includes(file.type)) return true;
  return /\.(png|jpe?g)$/i.test(file.name);
};

const isNotFutureDate = (date: Date) => {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return date.getTime() <= endOfToday.getTime();
};

const isValidYears = (value: string) => {
  if (!/^\d{1,2}$/.test(value)) return false;
  const years = Number(value);
  return years >= 0 && years <= 40;
};

export function requiresBreedingFields(sex: string, age: string) {
  return sex === "femea" && isValidYears(age) && Number(age) >= 2;
}

const bovinoFormSchema = z
  .object({
    name: z.string().trim().min(1, "Informe o nome do bovino"),
    sex: z
      .enum(["macho", "femea", ""])
      .refine(
        (value): value is BovinoSex => value === "macho" || value === "femea",
        "Selecione o sexo",
      ),
    purchaseDate: z
      .custom<Date | null>(
        (value) => value === null || value instanceof Date,
        "Informe a data da compra",
      )
      .refine(
        (value): value is Date =>
          value instanceof Date && !Number.isNaN(value.getTime()),
        "Informe a data da compra",
      )
      .refine(isNotFutureDate, "A data não pode ser futura"),
    weight: z
      .string()
      .trim()
      .refine((value) => {
        if (!value) return true;
        const weight = parseWeight(value);
        return Number.isFinite(weight) && weight > 0 && weight <= 3000;
      }, "Informe um peso válido em kg"),
    age: z.string().trim().refine(isValidYears, "Informe a idade em anos"),
    calfAge: z.string(),
    heatDate: z.custom<Date | null>(
      (value) => value === null || value instanceof Date,
      "Informe a data do cio",
    ),
    origin: z.string().trim().min(1, "Informe a procedência"),
    photo: z
      .custom<File | null>(
        (value) => value === null || value instanceof File,
        "Arquivo inválido",
      )
      .refine(
        (file) => file === null || isAcceptedPhoto(file),
        "Envie uma foto PNG ou JPG",
      )
      .refine(
        (file) => file === null || file.size <= MAX_PHOTO_BYTES,
        "A foto deve ter no máximo 10MB",
      ),
    observations: z
      .string()
      .trim()
      .max(500, "As observações devem ter no máximo 500 caracteres"),
  })
  .superRefine((data, ctx) => {
    if (!requiresBreedingFields(data.sex, data.age)) return;

    if (!isValidYears(data.calfAge)) {
      ctx.addIssue({
        code: "custom",
        path: ["calfAge"],
        message: "Informe a idade da cria",
      });
    }

    if (
      !(data.heatDate instanceof Date) ||
      Number.isNaN(data.heatDate.getTime())
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["heatDate"],
        message: "Informe a data do cio",
      });
      return;
    }

    if (!isNotFutureDate(data.heatDate)) {
      ctx.addIssue({
        code: "custom",
        path: ["heatDate"],
        message: "A data do cio não pode ser futura",
      });
    }
  });

export type BovinoFormValues = z.input<typeof bovinoFormSchema>;
export type BovinoFormSubmit = z.output<typeof bovinoFormSchema>;

const emptyValues: BovinoFormValues = {
  name: "",
  sex: "",
  purchaseDate: null,
  weight: "",
  age: "",
  calfAge: "",
  heatDate: null,
  origin: "",
  photo: null,
  observations: "",
};

type UseBovinoFormValidationParams = {
  initialValues?: Partial<BovinoFormValues>;
};

export const useBovinoFormValidation = ({
  initialValues,
}: UseBovinoFormValidationParams = {}) => {
  return useForm<BovinoFormValues, unknown, BovinoFormSubmit>({
    resolver: zodResolver(bovinoFormSchema),
    defaultValues: {
      ...emptyValues,
      ...initialValues,
    },
  });
};
