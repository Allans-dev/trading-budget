import { googleAuthSignIn, anonAuth } from '../../App/firebase-model';

import googleBtn from './google_signin_btn.png';
import './signin_style.css';

const SignIn = ({ policyMatch, toggleLoading }) => {
  return (
    <article
      className='signInComponent'
      style={{
        display:
          policyMatch !== null && policyMatch.isExact === true
            ? 'none'
            : 'block',
      }}
    >
      <button
        className='signin-btn'
        onClick={() => {
          toggleLoading(true);
          googleAuthSignIn();
        }}
      >
        <img alt='google sign in icon' src={googleBtn} />
      </button>
      <button
        className='anon-signin-btn signin-btn'
        onClick={() => {
          toggleLoading(true);
          anonAuth();
        }}
      >
        Guest Sign In
      </button>
    </article>
  );
};

export default SignIn;
