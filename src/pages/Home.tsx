import { useEffect } from 'react';
import '../styles/home.scss';
import { useAuth } from '../hooks/useAuth';

export function Home() {

    const { user, singInWithGoogle } = useAuth();

    useEffect(() => {
        async function signIn(){
            if(!user) {
                await singInWithGoogle();
            }
        }
        signIn();
    });

    return (
        <div id="home">
            <aside className="aside-contacts">
                <header className='aside-header'>
                    <div className='user-image-name'>
                        <img src={user?.avatar} alt='avatar'/>
                        <span>{user?.name}</span>
                    </div>
                    <span>+</span>
                </header>
            </aside>
            <main className="chat-screen">
                <header className='main-header'>
                    <span>IMG</span>
                    <span>NAME</span>
                </header>
            </main>
        </div>
    );
}