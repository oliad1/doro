import IAuthService from "../implementations/authService";
import logger from "../../utils/logger";
import { supabase } from "../../models/index";

const Logger = logger(__filename);

class AuthService implements IAuthService {

  constructor () {
  }

  async decodeJWT (jwt: string) {
    const { data: { user } } = await supabase.auth.getUser(jwt);
    console.log("UID: ", user?.id, jwt);
    return user?.id;
  };
  
  async isAuthorizedByExistence(jwt: string): Promise<boolean> {
    try {
      const id = await this.decodeJWT(jwt);
      return !!id;
    } catch (error: unknown) {
      Logger.error(`Unable to authourize user.`);
      return false;
    }
  };
};

export default AuthService;
