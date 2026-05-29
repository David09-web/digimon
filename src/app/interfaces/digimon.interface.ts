export interface Digimon {
  id: number;
  name: string;
  href: string;
  image: string;
  level?: string;
}

export interface Pageable {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface DigimonResponse {
  content: Digimon[];
  pageable: Pageable;
}

export interface DigimonImage {
  href: string;
  transparent: boolean;
}

export interface DigimonLevel {
  id: number;
  level: string;
}

export interface DigimonType {
  id: number;
  type: string;
}

export interface DigimonAttribute {
  id: number;
  attribute: string;
}

export interface DigimonField {
  id: number;
  field: string;
  image: string;
}

export interface DigimonSkill {
  id: number;
  skill: string;
  translation: string;
  description: string;
}

export interface DigimonDescription {
  language: string;
  description: string;
}

export interface DigimonDetail {
  id: number;
  name: string;
  images: DigimonImage[];
  levels: DigimonLevel[];
  types: DigimonType[];
  attributes: DigimonAttribute[];
  fields: DigimonField[];
  skills: DigimonSkill[];
  descriptions: DigimonDescription[];
}
