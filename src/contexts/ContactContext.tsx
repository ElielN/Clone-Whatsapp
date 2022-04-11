import { createContext, ReactNode, useState } from "react";

type currentContactType = {
    id: string,
    name: string,
    avatar: string,
    email: string,
};

type ContactContextProviderProps = {
    children: ReactNode,
};

type ContactContextType = {
    currentContact: currentContactType | undefined, 
    setCurrentContact: Function, 
};


const currentContactDefault = {
    id: '',
    name: '',
    avatar: '',
    email: ''
};

export const ContactContext = createContext({} as ContactContextType);

export function ContactContextProvider(props: ContactContextProviderProps){

    const [currentContact, setCurrentContact] = useState<currentContactType>(currentContactDefault);

    return (
        <ContactContext.Provider value={{currentContact, setCurrentContact}}>
            {props.children}
        </ContactContext.Provider>
    );
}