export const addressDataToGet = {
  select: {
    postalCode: true,
    street: true,
    street_number: true,
    district: true,
    city: true,
    UF: true,
    created_at: true,
    updated_at: true,
  },
};

export interface Iaddress {
  postalCode: string;
  street: string;
  street_number: string;
  district: string;
  city: string;
  UF: string;
  created_at: Date;
  updated_at: Date | null;
}
