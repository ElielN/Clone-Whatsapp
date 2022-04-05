import '../styles/signInPage.scss';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function SignInPage() {

    const navigate = useNavigate();

    const { user, singInWithGoogle } = useAuth();

    async function signIn(){
        console.log('clicou')
        if(!user) {
            await singInWithGoogle();
        }
        navigate('/home');
    }

    return (
        <div id="signin-page">
            <button className='signin-button' onClick={signIn}>
                SIGN IN
            </button>
        </div>
    );
}