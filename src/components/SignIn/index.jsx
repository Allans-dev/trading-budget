import { googleAuthSignIn, anonAuth } from '../../App/firebase-model';

const SignIn = ({ policyMatch, signInAuth, accessReadFromDb }) => {
  return (
    <section
      id='signInSection'
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
    </section>
  );
};

export default SignIn;
