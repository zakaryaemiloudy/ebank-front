export interface AccountDetails {
  accountId:            string;
  balance:              number;
  currentPage:          number;
  totalPages:           number;
  pageSize:             number;
  status:               AccountStatus;
  accountOperationDTOS: AccountOperation[];
}

export interface AccountOperation {
  id:            number;
  operationDate: Date;
  amount:        number;
  type:          string;
  description:   string;
}

export enum AccountStatus {
  CREATED = 'CREATED',
  ACTIVATED = 'ACTIVATED',
  SUSPENDED = 'SUSPENDED'
}

export interface BankAccount {
  type:         string;
  id:           string;
  balance:      number;
  createdAt:    Date;
  status:       AccountStatus;
  customerDTO:  CustomerDTO;
  interestRate?: number;
  overDraft?:   number;
}

export interface CustomerDTO {
  id:    number;
  name:  string;
  email: string;
}
