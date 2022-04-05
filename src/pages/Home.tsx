import { useAuth } from '../hooks/useAuth';
//import { onValue, ref } from '../services/firebase';
import '../styles/home.scss';

export function Home() {

    const { user, singInWithGoogle } = useAuth();

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
                <div className='main-footer'>

                </div>
            </main>
        </div>
    );
}