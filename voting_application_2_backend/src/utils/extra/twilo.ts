import twilo from "twilio";
import serverconfig from "../../config/serverconfig";
export const client = twilo(
  serverconfig.TWILO_ACCOUNT_SID,
  serverconfig.TWILO_AUTH_TOKEN
);
