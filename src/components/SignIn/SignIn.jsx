const SignIn = ({ ui, uiConfig, signInAnon }) => {
  return (
    <>
      <button className="anon-sign-btn" onClick={signInAnon}>
        Guest Sign In
      </button>
    </>
  );
};

export default SignIn;
