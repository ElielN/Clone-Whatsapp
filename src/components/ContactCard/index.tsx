import './styles.scss';

type contactCardType = {
    username: string,
    avatar: string
};

export function ContactCard({username, avatar} : contactCardType) {
    return (
        <div className="contact-card">
            <h1>card</h1>
        </div>
    );
}