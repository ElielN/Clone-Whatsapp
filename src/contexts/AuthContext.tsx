import { createContext, ReactNode, useEffect, useState } from 'react';
import { GoogleAuthProvider, auth, signInWithPopup } from '../services/firebase';

type User = {
    id: string,
    name: string,
    avatar: string,
}
  
type AuthContextType = {
    user: User | undefined, // No primeiro momento não temos usuário logado então pode ser undefined
    singInWithGoogle: () => Promise<void>, // Retorna uma promise porque estamos usando async await. Com then era só por void
}

type AuthContextProviderProps = {
    children: ReactNode, 
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();

    // Quando atualizamos a página perdemos o state que armazena o login do usuário
    // então usamos esse useEffect para manter o login mesmo após atualizar
    // O onAuthStateChanged é um eventListener que vai detectar se um usuário já estava
    // logado na nossa aṕlicação. Caso seja verdadeiro, ele nos retorna esse usuário
    // e fazemos o processo como se estivéssemos o logando de novo, preenchendo as informações do state user
    useEffect(() => {
      // É recomendado salvar um event listener em uma variável
      const unsubscribe = auth.onAuthStateChanged(user => {
        if(user) {
          const { displayName, photoURL, uid} = user;
  
          if(!displayName || !photoURL) {
            throw new Error('Missing information from Google Account.')
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          });
        }
      });
  
      // Salvamos o event listener em uma variável para posteriormente poder
      // pararmos esse evento. Se não fizermos isso, ao trocarmos de página o
      // evento ainda ficará ocorrendo
      return () => {
        unsubscribe();
      }
    }, []);
  
    async function singInWithGoogle() {
      // Autenticação no firebase usando google
      const provider = new GoogleAuthProvider();
  
      const result = await signInWithPopup(auth, provider);
  
      if(result.user) {
        const { displayName, photoURL, uid} = result.user;
  
        if(!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.')
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });
      }
    };

    return (
        <AuthContext.Provider value={{ user, singInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}