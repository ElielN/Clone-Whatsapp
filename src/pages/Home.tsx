import { useAuth } from '../hooks/useAuth';
import { BsPersonPlusFill } from "@react-icons/all-files/bs/BsPersonPlusFill";
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import { GiMagnifyingGlass } from '@react-icons/all-files/gi/GiMagnifyingGlass';
import { FiPaperclip } from '@react-icons/all-files/fi/FiPaperclip'
import { ModalAddContact } from '../components/ModalAddContact';
import { database, query, collection, getDocs, addDoc, orderBy, onSnapshot } from '../services/firebase';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { MemoizedContactCard } from '../components/ContactCard';
import { ContactContext } from '../contexts/ContactContext';
import { MemoizedMessage } from '../components/Message';
import whatsappBackground from '../assets/images/wpp_background.png';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../styles/home.scss';

type contactType = {
    id: string,
    username: string,
    avatar: string
};

type timeType = {
    day: number,
    month: number,
    year: number,
    hour: number,
    minute: number,
    second: number

}

type newMessageType = {
    sender: string | undefined,
    message: string,
    time: timeType
}

type messageChatType = {
    id: string,
    sender: string | undefined,
    message: string,
    time: timeType
}

export function Home() {

    const [modal, setModal] = useState<boolean>(false);
    const [contacts, setContacts] = useState<contactType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const [messagesChat, setMessagesChat] = useState<messageChatType[]>([]);

    const contactsRef = useRef<contactType[]>([]);
    const messagesChatRef = useRef<messageChatType[]>([]);

    const { user } = useAuth();
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
                    time: {
                        day: new Date().getUTCDate(),
                        month: new Date().getUTCMonth(),
                        year: new Date().getUTCFullYear(),
                        hour: new Date().getUTCHours(),
                        minute: new Date().getUTCMinutes(),
                        second: new Date().getUTCSeconds()
                    }
                }

                await addDoc(collection(database, `users/${user?.email}/contacts/${currentContact?.email}/messages`), newMessage);
                await addDoc(collection(database, `users/${currentContact?.email}/contacts/${user?.email}/messages`), newMessage);
    
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
        handleLoadContacts();
    },[handleLoadContacts]);

    useEffect(() => {
        if(currentContact?.email !== ''){
            onSnapshot(collection(database, `users/${user?.email}/contacts/${currentContact?.email}/messages`), async (ndoc) => {
                messagesChatRef.current = [];
                setMessagesChat(messagesChatRef.current);
                let messageBase : messageChatType = {
                    id: '',
                    sender: '',
                    message: '',
                    time: {
                        day: -1,
                        month: -1,
                        year: -1,
                        hour: -1,
                        minute: -1,
                        second: -1,
                    },
                };
                const q = query(collection(database, `users/${user?.email}/contacts/${currentContact?.email}/messages`), orderBy("time"));
                await getDocs(q).then(querySnapshot => {
                    console.log(querySnapshot);
                    messagesChatRef.current = [];
                    setMessagesChat(messagesChatRef.current);
                    querySnapshot.forEach((doc) => {
                        messageBase = {
                            id: '',
                            sender: '',
                            message: '',
                            time: {
                                day: -1,
                                month: -1,
                                year: -1,
                                hour: -1,
                                minute: -1,
                                second: -1,
                            },
                        };
                        messageBase.id = doc.id;
                        messageBase.sender = doc.data().sender;
                        messageBase.message = doc.data().message;

                        messageBase.time.day = doc.data().time["day"];
                        messageBase.time.hour = doc.data().time["hour"];
                        messageBase.time.minute = doc.data().time["minute"];
                        messageBase.time.month = doc.data().time["month"];
                        messageBase.time.second = doc.data().time["second"];
                        messageBase.time.year = doc.data().time["year"];

                        messagesChatRef.current.push(messageBase);
                    });
                    messagesChatRef.current = messagesChatRef.current.sort(function(a : messageChatType, b : messageChatType) {
                        if(a.time.year > b.time.year) return 1;
                        else if(a.time.year < b.time.year) return -1;
                        if(a.time.month > b.time.month) return 1;
                        else if(a.time.month < b.time.month) return -1;
                        if(a.time.day > b.time.day) return 1;
                        else if(a.time.day < b.time.day) return -1;
                        if(a.time.hour > b.time.hour) return 1;
                        else if(a.time.hour < b.time.hour) return -1;
                        if(a.time.minute > b.time.minute) return 1;
                        else if(a.time.minute < b.time.minute) return -1;
                        if(a.time.second > b.time.second) return 1;
                        else if(a.time.second < b.time.second) return -1;
                        return 1;
                    });
                }).then(after => {
                    setMessagesChat(messagesChatRef.current);
                })
            })
        }
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
                                    <MemoizedContactCard
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
                    <div className='chat-image' style={{
                        backgroundImage: 'url('+whatsappBackground + ')',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: 'rgb(11, 20, 26)',
                        opacity: 0.05,
                    }}>
                    </div>
                    <ScrollToBottom 
                    checkInterval={0}
                    
                    className='chat'>
                        {currentContact?.email !== '' && (
                            messagesChat.map(msg => {
                                return (
                                    <MemoizedMessage 
                                    key={msg.id}
                                    sender={msg.sender}
                                    message={msg.message}
                                    />
                                );
                            })
                        )}
                    </ScrollToBottom>
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