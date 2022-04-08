import { BsPersonPlusFill } from "@react-icons/all-files/bs/BsPersonPlusFill";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { database, doc, getDoc, setDoc } from '../../services/firebase';
import './styles.scss';

type changeStateType = {
    changeState: Function;
}
export function ModalAddContact({changeState} : changeStateType) {

    const [newContact, setNewContact] = useState<string>('');

    const { user, singInWithGoogle } = useAuth();

    async function handleAddContact() {
        if(newContact === user?.email) {
            window.alert('Você não pode se adicionar :(');
            return;
        }
        if(newContact === '') {
            window.alert('Preencha o campo com um e-mail válido');
            return;
        }
        const docRef = doc(database, 'users', newContact);
        const docSnap = await getDoc(docRef);
        if(!docSnap.exists()) {
            window.alert(`Não existe usuário com email ${newContact} cadastrado`);
        } else {
            const docObj = docSnap.data();
            
            const docRefNewContact = doc(database, `users/${user?.email}/contacts`, newContact);
            const docNewConstactSnap = await getDoc(docRefNewContact);
            
            const docRefNewContactBack = doc(database, `users/${newContact}/contacts`, user!.email);

            if(!docNewConstactSnap.exists()) {
                await setDoc(docRefNewContact, {
                    username: docObj.username,
                    userphoto: docObj.userphoto
                });
                await setDoc(docRefNewContactBack, {
                    username: user?.name,
                    userphoto: user?.avatar
                });
                window.alert('Novo contato adicionado!!');
            } else {
                window.alert('Você já possui este contato adicionado');
            }
        }
        changeState();
    }

    return (
        <div className="modal-add-contact">
            <input placeholder={'contact-exemple@gmail.com'} value={newContact} onChange={(event) => setNewContact(event.target.value)}/>
            <button className="button-add" onClick={handleAddContact}>
                <BsPersonPlusFill cursor={'pointer'} />
            </button>
            <button className="button-close" onClick={changeState()}>
                <AiOutlineClose cursor={'pointer'}/>
            </button>
        </div>
    );
}