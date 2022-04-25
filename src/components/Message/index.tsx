import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import './styles.scss'

type messageType = {
    sender: string | undefined,
    message: string
}

export function Message({sender, message} : messageType) {

    const [senderSide, setSenderSide] = useState<String>('');

    const { user } = useAuth();

    useEffect(() => {
        if(sender === user?.email) {
            setSenderSide('right');
        } else {
            setSenderSide('left');
        }
    }, [sender, user?.email]);

    return (
        <div className={`message-row-area ${senderSide}`}>
            <div className="message-container">
                <span>{message}</span>
            </div>
        </div>
    );
}