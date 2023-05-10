import { googleAuth } from '../../App/firebase-model';

const SignIn = ({ policyMatch }) => {
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
      {/* <button className='anon-sign-btn' onClick={signInAnon}>
        Guest Sign In
      </button> */}
      <button className='anon-sign-btn' onClick={googleAuth}>
        Google Sign In
      </button>
    </section>
  );
};

export default SignIn;
