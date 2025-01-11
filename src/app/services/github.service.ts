import { inject, Injectable, signal } from '@angular/core';
import { Contribution } from '../models/Contribution';
import { Apollo } from 'apollo-angular';
import { GET_AUTHENTICATED_USER_CONTRIBUTIONS, GET_USER } from './github.graphql';
import { map, Observable } from 'rxjs';
import { User } from '../models/User';
import { Providers } from '../enums/providers';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  contributions = signal<Contribution[]>([]);
  private apollo = inject(Apollo);
  from = '2024-01-01T00:00:00Z';
  to = '2024-12-31T23:59:59Z';

  getContributions(githubApiKey: string) : Observable<Contribution[]>
  {
    return this.apollo.query({
      query: GET_AUTHENTICATED_USER_CONTRIBUTIONS,
      context: {
        headers: { Authorization: `Bearer ${githubApiKey}` }
      },
      variables: { from: this.from, to: this.to },
      fetchPolicy: 'no-cache'
    }).pipe(
      map((result: any) => result.data.viewer.contributionsCollection.contributionCalendar.weeks),
      map((weeks: any[]) => weeks.reduce((acc, week) => acc.concat(week.contributionDays), []))
    )
  }

  getUser(githubApiKey: string) : Observable<User>
  {
    return this.apollo.query({
      query: GET_USER,
      context: {
        headers: { Authorization: `Bearer ${githubApiKey}` }
      },
      fetchPolicy: 'no-cache'
    }).pipe(map((result: any) => {
      return {
        name: result.data.viewer.login,
        avatarUrl: result.data.viewer.avatarUrl,
        displayName: result.data.viewer.name,
        provider: Providers.GitHub,
      }
    }));
  }
}
