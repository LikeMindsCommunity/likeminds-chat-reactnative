export class Credentials {
  private static _apiKey: string = '';
  private static _username: string = '';
  private static _userUniqueId: string = '';

  static setCredentials(
    username: string,
    userUniqueId: string,
    apiKey: string,
  ): void {
    Credentials._apiKey = apiKey;
    Credentials._username = username;
    Credentials._userUniqueId = userUniqueId;
  }

  static get apiKey(): string {
    return Credentials._apiKey;
  }

  static get username(): string {
    return Credentials._username;
  }

  static get userUniqueId(): string {
    return Credentials._userUniqueId;
  }
}
