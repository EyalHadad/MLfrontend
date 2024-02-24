import { createContext } from "react";
const AlertContext = createContext({
    type: null,
    titleText: null,
    bodyText: null,
    action: null,
    set: () => {}
});
// https://reactjs.org/docs/context.html

// https://jujuontheweb.medium.com/react-usecontext-hook-to-make-an-alert-notification-system-for-your-entire-application-721b4c6b7d0f
export default AlertContext;