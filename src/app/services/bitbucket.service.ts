import { HttpClient } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { map } from 'rxjs';
import { Providers } from '../enums/providers';
import { ConfigService } from './config.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BitbucketService {

  httpClient = inject(HttpClient);
  configService = inject(ConfigService);

  getContributions(bitbucketApiKey: string, username: string) {
    return this.httpClient.post<any>(`${environment.backendUrl}/getcontributions`, {
      baseURL: this.configService.get(Providers.Bitbucket),
      bitbucketAPIKey: bitbucketApiKey,
      username: username
    });
  }

  getUser(bitbucketApiKey: string, username: string) {
    return this.httpClient.post<any>(`${environment.backendUrl}/getuser`, {
      baseURL: this.configService.get(Providers.Bitbucket),
      bitbucketAPIKey: bitbucketApiKey,
      username: username
    });
  }

  // If you are running the app in development mode, and don't want to run .NET Backend, you need to use proxy.conf.json to avoid CORS issues
  getContributionsProxy(bitbucketApiKey: string, username: string) {
    const start = new Date('2024-01-01');
    const end = new Date('2024-12-31');
    const endpoint = `/rest/awesome-graphs/latest/user/activities/${username}?from=2024-01-01&to=2024-12-31`;

    var url = isDevMode() ? endpoint : this.configService.get(Providers.Bitbucket) + endpoint;
    return this.httpClient
      .get<any>(url,
        { headers: { Authorization: `Bearer ${bitbucketApiKey}` } }
      )
      .pipe(
        map(result => {
          // The API returns only non-zero contribution days
          // So I need to create a list of all days in the year
          const contributions: { date: string; contributionCount: number }[] = [];
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            contributions.push({
              date: d.toISOString().substring(0, 10),
              contributionCount: 0
            });
          }

          Object.keys(result).forEach(date => {
            const item = contributions.find(c => c.date === date);
            if (item) {
              item.contributionCount = result[date].length;
            }
          });
          return contributions;
        })
      );
  }

  getUserProxy(bitbucketApiKey: string, username: string) {
    var url = isDevMode() ? `/rest/api/latest/users/${username}?avatarSize=64` : this.configService.get(Providers.Bitbucket) + `/rest/api/latest/users/${username}?avatarSize=64`;
    return this.httpClient.get(url, {
      headers: { Authorization: `Bearer ${bitbucketApiKey}` }
    }).pipe(map((result: any) => {
      return {
        name: result.name,
        avatarUrl: result.avatarUrl,
        displayName: result.displayName,
        provider: Providers.Bitbucket
      }
    }));
  }

  // I was trying to calculate contributions by fetching commits and PRs from Bitbucket API
  // but later I found awesome-graphs API so I used it instead of these functions

  // getProjects(bitbucketApiKey: string) : Observable<string[]> 
  // {
  //   return this.httpClient.get<string[]>(`/rest/api/latest/projects/`, {
  //     headers: { Authorization: `Bearer ${bitbucketApiKey}` }
  //   }).pipe(map((result: any) => result.values)).pipe(map((values: any[]) => values.map(value => value.key)));
  // }

  // getRepositories(bitbucketApiKey: string, projectKey: string) : Observable<string[]>
  // {
  //   return this.httpClient.get<string[]>(`/rest/api/latest/projects/${projectKey}/repos`, {
  //     headers: { Authorization: `Bearer ${bitbucketApiKey}` }
  //   }).pipe(map((result: any) => result.values)).pipe(map((values: any[]) => values.map(value => value.slug)));
  // }

  // fetchCommits(bitbucketApiKey: string, projectKey: string, repositorySlug: string, authorName: string, startCount: number = 0) : Observable<any>
  // {
  //   return this.httpClient.get<any>(`/rest/api/latest/projects/${projectKey}/repos/${repositorySlug}/commits?start=${startCount}&limit=750`, {
  //     headers: { Authorization: `Bearer ${bitbucketApiKey}` }
  //   }).pipe(map((result: any) => result.values))
  //     .pipe(map((values: any[]) => values
  //       .filter(value => value.author.name === authorName && 1704187416000 <= value.authorTimestamp)
  //       .map(value => ({
  //         commitTimestamp: value.authorTimestamp,
  //       }))
  //     ));
  // }

  // getCommits(bitbucketApiKey: string, projectKey: string, repositorySlug: string, authorName: string) : Observable<any>
  // {
  //   let accumulator = 0;
  //   const incrementor = 100;
  //   return this.fetchCommits(bitbucketApiKey, projectKey, repositorySlug, authorName, 0)
  //   .pipe(
  //     expand(res => {
  //       console.log(`---------${repositorySlug}---------`);
  //       console.log(res);
  //       if(res.length === 0) return EMPTY;
  //       if(1704187416000 <= res[res.length - 1].authorTimestamp)
  //       {
  //         console.log("fetching more commits");
  //         return this.fetchCommits(bitbucketApiKey, projectKey, repositorySlug, authorName, accumulator += incrementor);
  //       }
  //       else
  //       {
  //         console.log("done fetching commits");
  //         return EMPTY;
  //       }
  //     }),
  //     reduce((acc, curr) => {
  //       console.log(`---------${repositorySlug}---------`);
  //       console.log(acc);
  //       console.log(curr);
  //     })
  //   )
  // }

  // unixTimestampContributionMapper(authorTimestamp: any): Contribution[] {
  //   const dailyCounts: { [date: string]: number } = {};
  //   const timestamps = Array.isArray(authorTimestamp) ? authorTimestamp : [authorTimestamp];
  
  //   timestamps.forEach(ts => {
  //     const dateKey = new Date(ts.commitTimestamp).toISOString().slice(0, 10);
  //     if (!dailyCounts[dateKey]) {
  //       dailyCounts[dateKey] = 0;
  //     }
  //     dailyCounts[dateKey]++;
  //   });
  
  //   return Object.entries(dailyCounts).map(([date, contributionCount]) => ({date: new Date(date), contributionCount }));
  // }
}

