import './styles.scss';

type contactCardType = {
    username: string,
    avatar: string
};

export function ContactCard({username, avatar} : contactCardType) {
    return (
        <div className="contact-card">
            <img src={avatar} alt='avatar' />
            <div className='username-container'>
                <span>{username}</span>
            </div>
        </div>
    );
}