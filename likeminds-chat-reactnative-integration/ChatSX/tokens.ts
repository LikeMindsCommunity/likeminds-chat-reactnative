export class Token {
  private static _accessToken: string = "";

  static setToken(accessToken: string): void {
    Token._accessToken = accessToken;
  }

  static get accessToken(): string {
    return Token._accessToken;
  }
}
