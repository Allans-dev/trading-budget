import { googleAuthSignIn, anonAuth } from '../../App/firebase-model';

import './signin_style.css';

const SignIn = ({ policyMatch, signInAuth, accessReadFromDb }) => {
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
      {/* <button
        className='anon-sign-btn'
        onClick={() => {
          googleAuthSignIn(signInAuth);
        }}
      >
        Google Sign In
      </button> */}
      <button
        className='anon-sign-btn'
        onClick={() => {
          anonAuth(signInAuth, accessReadFromDb);
        }}
      >
        Guest Sign In
      </button>
    </article>
  );
};

export default SignIn;
