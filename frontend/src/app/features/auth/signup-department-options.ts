export interface SignupDepartmentOption {
  code: string;
  name: string;
  specialties: string[];
}

export const SIGNUP_DEPARTMENT_OPTIONS: readonly SignupDepartmentOption[] = [
  {
    code: 'MANAGEMENT',
    name: 'Management',
    specialties: ['Finance', 'Comptabilite', 'Marketing', 'Management strategique', 'RH']
  },
  {
    code: 'IMA',
    name: 'IMA',
    specialties: ['Informatique de gestion', "Systemes d'information", 'Intelligence artificielle appliquee', 'Business Analytics']
  },
  {
    code: 'LACC',
    name: 'LACC',
    specialties: ['Francais', 'Anglais', 'Communication organisationnelle', 'Redaction professionnelle']
  }
];
