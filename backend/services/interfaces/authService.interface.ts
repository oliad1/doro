interface IAuthService {
  isAuthorizedByExistence(accessToken: string): Promise<boolean>
}

export default IAuthService;
