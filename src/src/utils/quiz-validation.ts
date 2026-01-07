import type { Answers, Question } from "@/stores/quiz";
import { z } from "zod";

const literalEnum = (values: string[]) =>
  values.length > 0
    ? z.union(values.map(v => z.literal(v)))
    : z.string().min(1);

export function getAnswerSchemaForQuestion(question: Question) {
  const type = question.type;
  switch (type) {
    case "radio":
    case "scale": {
      const ids = question.options.map(o => o.id);
      return literalEnum(ids).refine(val => ids.includes(val), {
        message: "Por favor selecciona una opción",
      });
    }
    case "multi": {
      const ids = question.options.map(o => o.id);
      return z.array(literalEnum(ids)).nonempty({
        message: "Debes seleccionar al menos una opción",
      });
    }
    case "number": {
      const min = question.meta?.min as number | undefined;
      const max = question.meta?.max as number | undefined;
      let schema = z.coerce.number();
      if (typeof min === "number" && typeof max === "number") {
        schema = schema
          .min(min, {
            message: `El valor debe estar entre ${min} y ${max}`,
          })
          .max(max, {
            message: `El valor debe estar entre ${min} y ${max}`,
          });
      } else if (typeof min === "number") {
        schema = schema.min(min, {
          message: `El valor debe ser al menos ${min}`,
        });
      } else if (typeof max === "number") {
        schema = schema.max(max, {
          message: `El valor no puede ser mayor a ${max}`,
        });
      }
      return schema;
    }
    case "text": {
      return z.string().min(1, {
        message: "Por favor escribe tu respuesta",
      });
    }
    case "boolean": {
      return z.boolean();
    }
    case "time": {
      // Accepts HH:mm or HH:mm:ss, 24h format; coerce from string
      return z
        .string()
        .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/, {
          message: "Debe ser una hora válida (08:00, 12:30, etc.)",
        });
    }
    case "compound": {
      const fields: Array<{
        id: string;
        label: string;
        type: string;
        min?: number;
        max?: number;
        unit?: string;
      }> = question.meta?.fields || [];
      const shape: Record<string, z.ZodTypeAny> = {};
      fields.forEach(f => {
        if (f.type === "number") {
          let s = z.coerce.number();
          if (typeof f.min === "number" && typeof f.max === "number") {
            s = s
              .min(f.min, {
                message: `${f.label} debe estar entre ${f.min} y ${f.max}`,
              })
              .max(f.max, {
                message: `${f.label} debe estar entre ${f.min} y ${f.max}`,
              });
          } else if (typeof f.min === "number") {
            s = s.min(f.min, {
              message: `${f.label} debe ser al menos ${f.min}`,
            });
          } else if (typeof f.max === "number") {
            s = s.max(f.max, {
              message: `${f.label} no puede ser mayor a ${f.max}`,
            });
          }
          shape[f.id] = s;
        } else if (f.type === "text") {
          shape[f.id] = z.string().min(1, {
            message: `Por favor completa ${f.label}`,
          });
        } else if (f.type === "boolean") {
          shape[f.id] = z.boolean();
        } else {
          shape[f.id] = z.any();
        }
      });
      return z.object(shape);
    }
    case "matrix": {
      const rows: Array<{ id: string; label: string }> =
        question.meta?.rows || [];
      const cols = question.options.map(o => o.id);
      const shape: Record<string, z.ZodTypeAny> = {};
      rows.forEach(r => {
        shape[r.id] = literalEnum(cols).refine(val => cols.includes(val), {
          message: `Selecciona una opción para: ${r.label}`,
        });
      });
      return z.object(shape);
    }
    default:
      return z.any();
  }
}

export function isAnswerValid(
  question: Question,
  value: Answers[Question["id"]]
): boolean {
  const schema = getAnswerSchemaForQuestion(question);
  const res = schema.safeParse(value as unknown);
  return res.success;
}

export function normalizeAnswer(
  question: Question,
  value: Answers[Question["id"]]
) {
  const schema = getAnswerSchemaForQuestion(question);
  const res = schema.safeParse(value as unknown);
  if (res.success) return res.data;
  return value;
}
