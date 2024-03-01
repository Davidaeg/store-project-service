export interface Person {
  personId: number;
  name: string;
  firstLastName: string;
  secondLastName: string;
  birthday: Date;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface CreatePersonDto {
  name: string;
  firstLastName: string;
  secondLastName: string;
  birthday: Date;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
}
