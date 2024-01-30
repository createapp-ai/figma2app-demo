import { IonContent, IonPage, IonToast } from '@ionic/react';
import { Link } from 'react-router-dom';

import {
  img_0ab085a356d847fea6fa547c997034d3,
  img_9ad1c6891577420c92a93324211a8a67,
  img_9bd9592aee914ffdb86aef39147b2602,
  img_656226ee124740fe8fdf11dc0893355a,
  img_d90afaf41f054bc882a264e18c129953,
} from '~/assets';

import { useLoginWithGoogle, useSignInWithCredentials } from './hooks';

function SignInScreen() {
  const { signInWithGoogle } = useLoginWithGoogle();
  const {
    signInWithCredentials,
    clearError,
    authError,
    authState,
    email,
    password,
  } = useSignInWithCredentials();

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <form
          className="w-full relative bg-white overflow-hidden flex flex-col items-center justify-start pt-[58px] pb-[39px] pr-[30px] pl-7 box-border gap-[20px] text-center text-[35px] text-darkslategray font-airbnb-cereal-app"
          onSubmit={(e) => {
            if (authState !== 'loading') {
              signInWithCredentials();
            }
            e.preventDefault();
          }}
        >
          <div className="h-32 flex flex-row items-start justify-start py-0 pr-0 pl-[19px] box-border">
            <div className="flex flex-col items-center justify-end pt-[68px] px-0 pb-0 relative">
              <h1 className="m-0 relative text-inherit leading-[138.2%] font-medium font-inherit">
                EventHub
              </h1>
              <img
                className="w-[55.5px] h-[57.3px] absolute my-0 mx-[!important] top-[-0.1px] left-[44px]"
                loading="eager"
                alt=""
                src={img_d90afaf41f054bc882a264e18c129953}
              />
            </div>
          </div>
          <section className="flex flex-col items-start justify-start gap-[26px] text-left text-[24px] text-color-typography-title font-airbnb-cereal-app w-[300px]">
            <h3 className="m-0 relative text-inherit font-bold font-inherit">
              Sign in
            </h3>
            <div className="self-stretch flex flex-col items-center justify-start gap-[39px] text-center text-base text-white">
              <div className="self-stretch flex flex-col items-center justify-center gap-[19px]">
                <div className=" rounded-xl bg-white flex flex-row items-start justify-start py-[17px] px-[15px] gap-[14px] border-[1px] border-solid border-gainsboro relative w-[300px]">
                  <div className="h-14 w-[317px]   rounded-xl bg-white box-border hidden border-[1px] border-solid border-gainsboro"></div>
                  <img
                    className="h-[22px] w-[22px] relative z-[2]"
                    alt=""
                    src={img_9ad1c6891577420c92a93324211a8a67}
                  />
                  <input
                    className="w-full absolute top-0 left-0 pl-[50px] pr-[20px] [border:none] [outline:none] bg-[transparent] h-full flex flex-col items-start justify-start pt-[3px] px-0 pb-0 box-border font-airbnb-cereal-app text-sm text-slategray"
                    placeholder="abc@email.com"
                    type="email"
                    value={email.value}
                    onChange={(e) => email.set(e.target.value)}
                  />
                </div>
                <div className="rounded-xl bg-white flex flex-row items-start justify-start py-[17px] px-[15px] gap-[14px] border-[1px] border-solid border-gainsboro relative w-[300px]">
                  <div className="h-14 w-[317px]   rounded-xl bg-white box-border hidden border-[1px] border-solid border-gainsboro"></div>
                  <img
                    className="h-[22px] w-[22px] relative z-[2]"
                    alt=""
                    src={img_9bd9592aee914ffdb86aef39147b2602}
                  />
                  <input
                    className="w-full absolute top-0 left-0 pl-[50px] pr-[20px] [border:none] [outline:none] bg-[transparent] h-full flex flex-col items-start justify-start pt-[3px] px-0 pb-0 box-border font-airbnb-cereal-app text-sm text-slategray"
                    placeholder="Your password"
                    type="password"
                    value={password.value}
                    onChange={(e) => password.set(e.target.value)}
                  />
                </div>
              </div>
              <button
                className={`w-[271px] flex flex-row items-center justify-center pt-[19px] pb-[18px] pr-6 pl-5 box-border relative bg-mediumslateblue font-airbnb-cereal-app rounded-xl shadow-lg text-base cursor-pointer text-white ${
                  authState === 'loading' ? 'opacity-50' : ''
                }`}
                type="submit"
                disabled={authState === 'loading'}
              >
                <div className="relative tracking-[1px] uppercase font-bold z-[1]">
                  {authState === 'loading' ? 'Sign in...' : 'Sign in'}
                </div>
              </button>
            </div>
          </section>
          <section className="self-stretch flex flex-row items-center justify-start pt-0 pb-[49px] text-center text-base text-darkgray font-airbnb-cereal-app">
            <div className="flex-1 flex flex-col items-center justify-start relative">
              <div className="my-0 mx-[!important] leading-[34px] font-bold">
                OR
              </div>
              <div
                className="flex-1 rounded-xl bg-white shadow-[15px_0px_30px_rgba(211,_212,_226,_0.25)] flex flex-row items-center justify-start pt-3.5 pb-[15px] px-[46px] gap-[17px] text-color-typography-title font-airbnb-cereal-app cursor-pointer"
                onClick={signInWithGoogle}
              >
                <img
                  className="h-[25.6px] w-[26px] relative z-[1]"
                  loading="eager"
                  alt=""
                  src={img_0ab085a356d847fea6fa547c997034d3}
                />

                <div className="relative leading-[25px] z-[1]">
                  Login with Google
                </div>
              </div>
            </div>
          </section>
          <img
            className="w-6 h-6 relative object-cover hidden"
            alt=""
            src={img_656226ee124740fe8fdf11dc0893355a}
          />

          <div className="relative text-[15px] leading-[25px] font-airbnb-cereal-app whitespace-pre-wrap text-color-typography-title">
            <span>Don’t have an account? </span>
            <Link to="/sign-up">
              <span className="text-mediumslateblue">Sign up</span>
            </Link>
          </div>
        </form>
        <IonToast
          isOpen={!!authError}
          onDidDismiss={clearError}
          message={`Error: ${authError}`}
          duration={3000}
          color={'danger'}
        />
      </IonContent>
    </IonPage>
  );
}

export default SignInScreen;
