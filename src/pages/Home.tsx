import { useAuth } from '../hooks/useAuth';
import { BsPersonPlusFill } from "@react-icons/all-files/bs/BsPersonPlusFill";
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import { ModalAddContact } from '../components/ModalAddContact';
import { database, query, collection, where, doc, getDocs } from '../services/firebase';
import { useCallback, useEffect, useState } from 'react';
import '../styles/home.scss';
import { ContactCard } from '../components/ContactCard';

type contactType = {
    id: string,
    username: string,
    avatar: string
};

export function Home() {

    const [modal, setModal] = useState<boolean>(false);
    const [contacts, setContacts] = useState<contactType[]>([]);

    const { user, singInWithGoogle } = useAuth();

    function toggleModalState() {
        setModal(modal ? false : true);
    }

    const handleLoadContacts = useCallback(async () => {
        let contactBase : contactType = {
            id: '',
            username: '',
            avatar: ''
        }
        const q = query(collection(database, `users/${user?.email}/contacts`)); 
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            contactBase.id = doc.id;
            contactBase.username = doc.data().username;
            contactBase.avatar = doc.data().userphoto;
            setContacts(c => [...c, contactBase]);
        });
    },[user?.email]);

    useEffect(() => {
        handleLoadContacts();
    },[handleLoadContacts]);
    
    return (
        <div id="home">
            <aside className="aside-contacts">
                <header className='aside-header'>
                    <div className='user-image-name'>
                        <img src={user?.avatar} alt='avatar'/>
                        <span>{user?.name}</span>
                    </div>
                    <span className='aside-header-icons'>
                        <BsPersonPlusFill cursor={'pointer'} onClick={toggleModalState}/>
                        <BsThreeDotsVertical cursor={'pointer'}/>
                    </span>
                </header>
                {modal && (
                    <ModalAddContact 
                    changeState={() => toggleModalState}
                    />
                )}
                <div className='column-contacts'>
                    {contacts.map(contact => {
                        return (
                            <ContactCard
                            key={contact.id} 
                            username={contact.username}
                            avatar={contact.avatar}
                            />
                        );
                    })}
                </div>
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