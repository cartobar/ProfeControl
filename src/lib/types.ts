// src/lib/types.ts
export interface Maestro {
  id: string;
  nombre: string;
}

export interface Grado {
  id: string;
  nombre: string;           // "Nursery", "Prepa", "Kinder", "1° Primaria", ...
  nivel: string;
  orden: number;
}

export interface Alumno {
  id: string;
  grado_id: string;
  num_lista: number;
  nombre_completo: string;
  created_at: Date;
}

export interface Tarea {
  id: string;
  grado_id: string;
  titulo: string;
  descripcion?: string;
  fecha_entrega: string;     // YYYY-MM-DD
  tipo: 'Tarea' | 'Examen' | 'Proyecto' | 'Actividad';
  created_at: Date;
}

export interface Calificacion {
  id: string;
  alumno_id: string;
  tarea_id: string;
  entregada: boolean;
  nota?: number;
  observacion?: string;
  updated_at: Date;
}

export type GradoNombre = 
  | "Nursery" 
  | "Prepa" 
  | "Pre-kinder" 
  | "Kinder" 
  | "1° Primaria" 
  | "2° Primaria" 
  | "3° Primaria" 
  | "4° Primaria" 
  | "5° Primaria" 
  | "6° Primaria";