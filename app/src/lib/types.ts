export interface InstitutionType {
  id: number;
  code: string;
  name: string;
  description: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Institution {
  id: number;
  name: string;
  code: string;
  institutionType: InstitutionType;
  address: string;
  phone: string;
  email: string;
  website: string;
  representative: string;
  establishedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  fieldErrors?: Record<string, string>;
}