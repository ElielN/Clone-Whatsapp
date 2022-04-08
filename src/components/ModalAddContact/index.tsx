import { BsPersonPlusFill } from "@react-icons/all-files/bs/BsPersonPlusFill";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { database, doc, getDoc, setDoc } from '../../services/firebase';
import './styles.scss';


export function ModalAddContact() {

    const [newContact, setNewContact] = useState<string>('');

    const { user, singInWithGoogle } = useAuth();

    async function handleAddContact() {
        const docRef = doc(database, 'users', newContact);
          const docSnap = await getDoc(docRef);
          if(!docSnap.exists()) {
            window.alert(`Não existe usuário com email ${newContact} cadastrado`);
          } else {
            window.alert(`O usuário ${newContact} foi encontrado!`);
          }

    }

    return (
        <div className="modal-add-contact">
            <input placeholder={'contact-exemple@gmail.com'} value={newContact} onChange={(event) => setNewContact(event.target.value)}/>
            <button className="button-add"><BsPersonPlusFill cursor={'pointer'} /></button>
            <button className="button-close"><AiOutlineClose cursor={'pointer'}/></button>
        </div>
    );
}