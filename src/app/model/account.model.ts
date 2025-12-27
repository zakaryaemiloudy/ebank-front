export interface AccountDetails {
  accountId:            string;
  balance:              number;
  currentPage:          number;
  totalPages:           number;
  pageSize:             number;
  accountOperationDTOS: AccountOperation[];
}

export interface AccountOperation {
  id:            number;
  operationDate: Date;
  amount:        number;
  type:          string;
  description:   string;
}

export interface BankAccount {
  type:         string;
  id:           string;
  balance:      number;
  createdAt:    Date;
  status:       string | null;
  customerDTO:  CustomerDTO;
  interestRate?: number;
  overDraft?:   number;
}

export interface CustomerDTO {
  id:    number;
  name:  string;
  email: string;
}
