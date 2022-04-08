import { useAuth } from '../hooks/useAuth';
import { BsPersonPlusFill } from "@react-icons/all-files/bs/BsPersonPlusFill";
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
//import { onValue, ref } from '../services/firebase';
import '../styles/home.scss';
import { ModalAddContact } from '../components/ModalAddContact';

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
                    <span className='aside-header-icons'>
                        <BsPersonPlusFill cursor={'pointer'} />
                        <BsThreeDotsVertical cursor={'pointer'}/>
                    </span>
                </header>
                <ModalAddContact />
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