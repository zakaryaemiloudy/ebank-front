import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountDetails, BankAccount } from '../model/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  constructor(private http: HttpClient) {}

  public getAllAccounts(): Observable<Array<BankAccount>> {
    return this.http.get<Array<BankAccount>>(environment.backendHost + '/accounts');
  }

  public getAccountById(accountId: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(environment.backendHost + '/accounts/' + accountId);
  }

  public getAccount(accountId: string, page: number, size: number): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(
      environment.backendHost + '/accounts/' + accountId + '/pageOperations?page=' + page + '&size=' + size
    );
  }

  public debit(accountId: string, amount: number, description: string) {
    let data = { accountId: accountId, amount: amount, description: description };
    return this.http.post(environment.backendHost + '/accounts/debit', data);
  }

  public credit(accountId: string, amount: number, description: string) {
    let data = { accountId: accountId, amount: amount, description: description };
    return this.http.post(environment.backendHost + '/accounts/credit', data);
  }

  public transfer(accountSource: string, accountDestination: string, amount: number, description: string) {
    let data = { accountSource, accountDestination, amount, description };
    return this.http.post(environment.backendHost + '/accounts/transfer', data);
  }

  public createAccount(account: any): Observable<any> {
    return this.http.post(environment.backendHost + '/accounts', account);
  }

  public deleteAccount(accountId: string): Observable<void> {
    return this.http.delete<void>(environment.backendHost + '/accounts/' + accountId);
  }

  public updateAccountStatus(accountId: string, status: string): Observable<BankAccount> {
    return this.http.put<BankAccount>(environment.backendHost + '/accounts/' + accountId + '/status', { status: status });
  }
}
