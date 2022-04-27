import React, { useContext } from 'react';
import { ContactContext } from '../../contexts/ContactContext';
import './styles.scss';

type contactCardType = {
    username: string,
    avatar: string,
    email: string
};

export function ContactCard({username, avatar, email} : contactCardType) {

    const { setCurrentContact } = useContext(ContactContext);

    function handleChangeContact() {
        const currentContact = {
            id: email,
            name: username,
            avatar: avatar,
            email: email,
        };
        setCurrentContact(currentContact);
    }

    return (
        <div className="contact-card" onClick={handleChangeContact}>
            <img src={avatar} alt='avatar' />
            <div className='username-container'>
                <span>{username}</span>
            </div>
        </div>
    );
}

export const MemoizedContactCard = React.memo(ContactCard);