import { useState } from "react";
import AlertContext from "./AlertContext";

export default function AlertProvider(props){
    const [type, setType] = useState(null);
    const [titleText, setTitleText] = useState(null);
    const [bodyText, setBodyText] = useState(null);
    const [action, setAction] = useState(null);
    
    const set = (type, title, body, action, time) => {      
      setType(type);      
      setTitleText(title);      
      setBodyText(body);
      setAction(action);
      setTimeout(()=>clear(), time);
    };
    const clear = () => {
        setType(null);      
        setTitleText(null);      
        setBodyText(null);
        setAction(null);
    };
    return (
        <AlertContext.Provider       
        value={{
            set, clear, type, titleText, bodyText, action
        }}>
            {props.children}    
        </AlertContext.Provider>
    )
}