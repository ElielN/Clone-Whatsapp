import { useAuth } from '../hooks/useAuth';
import { BsPersonPlusFill } from "@react-icons/all-files/bs/BsPersonPlusFill";
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import { GiMagnifyingGlass } from '@react-icons/all-files/gi/GiMagnifyingGlass';
import { FiPaperclip } from '@react-icons/all-files/fi/FiPaperclip'
import { ModalAddContact } from '../components/ModalAddContact';
import { database, query, collection, where, doc, getDocs, getDoc, addDoc } from '../services/firebase';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ContactCard } from '../components/ContactCard';
import whatsappBackground from '../assets/images/wpp_background.png';

import '../styles/home.scss';
import { ContactContext } from '../contexts/ContactContext';
import { Message } from '../components/Message';

type contactType = {
    id: string,
    username: string,
    avatar: string
};

type newMessageType = {
    sender: string | undefined,
    message: string
}

type messageChatType = {
    id: string,
    sender: string | undefined,
    message: string
}

export function Home() {

    const [modal, setModal] = useState<boolean>(false);
    const [contacts, setContacts] = useState<contactType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const [messagesChat, setMessagesChat] = useState<messageChatType[]>([]);

    const contactsRef = useRef<contactType[]>([]);
    const messagesChatRef = useRef<messageChatType[]>([]);

    const { user, singInWithGoogle } = useAuth();
    const { currentContact } = useContext(ContactContext);

    async function handleSendMessage() {
        if(currentContact?.email === '') {
            setMessage('');
            return;
        } else {
            if(message === '') {
                return
            } else {
                const newMessage : newMessageType = {
                    sender: user?.email,
                    message: message,
                }
                const docRefMessage = await addDoc(collection(database, `users/${user?.email}/contacts/${currentContact?.email}/messages`), newMessage);
                const docRefMessageBack = await addDoc(collection(database, `users/${currentContact?.email}/contacts/${user?.email}/messages`), newMessage);
                //const docRefMessageSnap = await getDoc(docRefMessage);
    
                setMessage('');
            }
        }
    }

    function handleKeyPress(event : any) {
        if(event.key === 'Enter') {
            handleSendMessage();
        }
    }

    function toggleModalState() {
        setModal(modal ? false : true);
    }

    const handleLoadContacts = useCallback(async () => {
        setLoading(true);
        contactsRef.current = [];
        setContacts(contactsRef.current);
        let contactBase : contactType = {
            id: '',
            username: '',
            avatar: ''
        }

        const q = query(collection(database, `users/${user?.email}/contacts`));
        await getDocs(q).then(querySnapshot => {
            contactsRef.current = [];
            setContacts(contactsRef.current);
            querySnapshot.forEach((doc) => {
                contactBase = {
                    id: '',
                    username: '',
                    avatar: ''
                }
                contactBase.id = doc.id;
                contactBase.username = doc.data().username;
                contactBase.avatar = doc.data().userphoto;
                contactsRef.current.push(contactBase);
                //setContacts(c => [...c, contactBase]);
            });
        }).then(after => {
            setContacts(contactsRef.current);
        }).then(a => {
            setTimeout(() => {setLoading(false)},300);  
        });
    },[user?.email]);

    useEffect(() => {
        setLoading(true);
        //setTimeout(() => {setLoading(false)},300); 
        handleLoadContacts();
    },[handleLoadContacts]);

    useEffect(() => {
        async function loadMessages() {
            setLoadingMessages(true);
            messagesChatRef.current = [];
            setMessagesChat(messagesChatRef.current);
            let messageBase : messageChatType = {
                id: '',
                sender: '',
                message: ''
            };
            if(currentContact?.email !== ''){
                const q = query(collection(database, `users/${user?.email}/contacts/${currentContact?.email}/messages`));
                await getDocs(q).then(querySnapshot => {
                    messagesChatRef.current = [];
                    setMessagesChat(messagesChatRef.current);
                    querySnapshot.forEach((doc) => {
                        messageBase = {
                            id: '',
                            sender: '',
                            message: ''
                        };
                        messageBase.id = doc.id;
                        messageBase.sender = doc.data().sender;
                        messageBase.message = doc.data().message;
                        messagesChatRef.current.push(messageBase);
                    })
                }).then(after => {
                    setMessagesChat(messagesChatRef.current);
                }).then(a => {
                    setTimeout(() => {setLoadingMessages(false)},300); 
                })
            }
        }
        loadMessages();
    }, [currentContact?.email, user?.email])
    
    return (
        <div id="home">
            <div className='home-background'>
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
                    <div className='aside-search'>
                        <div className='search-input'>
                            <GiMagnifyingGlass 
                            />
                            <input placeholder='Search here'/>
                        </div>
                    </div>
                    {!loading && (
                        <div className='column-contacts'>
                            {contacts.map(contact => {
                                return (
                                    <ContactCard
                                    key={contact.id} 
                                    username={contact.username}
                                    avatar={contact.avatar}
                                    email={contact.id}
                                    />
                                );
                            })}
                        </div>
                    )}
                </aside>
                <main className="chat-screen">
                    <header className='main-header'>
                        {currentContact?.name !== '' && (
                        <div className='main-header-content'>
                            <img src={currentContact?.avatar} alt=''/>
                            <span>{currentContact?.name}</span>
                        </div>
                        )}
                    </header>
                    <div className='chat' style={{
                    backgroundImage: 'url('+whatsappBackground + ')',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'rgb(11, 20, 26)',
                    opacity: 0.05,
                    }}>
                    {currentContact?.email !== '' && (
                        messagesChat.map(msg => {
                            return (
                                <Message 
                                key={msg.id}
                                sender={msg.sender}
                                message={msg.message}
                                />
                            );
                        })
                    )}
                    </div>
                    <div className='main-footer'>
                        <div className='footer-content'>
                            <FiPaperclip 
                            cursor={'pointer'}
                            />
                            <div className='footer-message-input'>
                                <input placeholder='Message' onKeyDown={handleKeyPress} value={message} onChange={(event) => setMessage(event.target.value)}/>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}