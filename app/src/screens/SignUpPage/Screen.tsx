import { IonContent, IonPage, IonToast } from '@ionic/react';
import { Link, useHistory } from 'react-router-dom';

import {
  img_408ab2c844df46f692894b8e96d27b5e,
  img_40552aad6ec74046b568a2f212e9230e,
  img_b6abf94517c741148a3f868c37f36a92,
  img_b653ae5a13194b8da9859c92c1c3164b,
  img_c55319262d9b4ce7b5cf33ecee0be2fc,
  img_d629df8dfe284b5f8488b953daace8c0,
  img_f35f8cae46bb465e9a4328f9dbdda9f5,
  img_f6411765315e45acabdd470596ba2b13,
} from '~/assets';

import { useSignUpWithCredentials, useSignUpWithGoogle } from './hooks';

function Screen() {
  const history = useHistory();
  const { signUpWithGoogle } = useSignUpWithGoogle();
  const {
    signUpWithCredentials,
    confirmPassword,
    email,
    error,
    fullName,
    modal,
    password,
    setModal,
    clearError,
    state,
  } = useSignUpWithCredentials();

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <form
          className="m-0 w-full relative bg-white overflow-hidden flex flex-col items-center justify-start pt-9 pb-[39px] pr-[30px] pl-6 box-border gap-[20px]"
          onSubmit={(e) => {
            if (state !== 'loading') {
              signUpWithCredentials();
            }
            e.preventDefault();
          }}
        >
          <div className="self-stretch flex flex-row items-start justify-start">
            <button
              className="cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-center justify-start gap-[20px]"
              onClick={() => history.goBack()}
              type="button"
            >
              <img
                className="h-[22px] w-[22px] relative"
                alt=""
                src={img_f6411765315e45acabdd470596ba2b13}
              />

              <div className="relative text-[24px] font-bold font-airbnb-cereal-app text-color-typography-title text-left">
                Sign up
              </div>
            </button>
          </div>
          <img
            className="w-6 h-6 relative object-cover hidden"
            alt=""
            src={img_b6abf94517c741148a3f868c37f36a92}
          />

          <img
            className="w-6 h-6 relative object-cover hidden"
            alt=""
            src={img_d629df8dfe284b5f8488b953daace8c0}
          />

          <section className="self-stretch flex flex-col items-center justify-start py-0 pr-0 pl-1">
            <div className="flex-1 flex flex-col items-center justify-start gap-[40px] max-w-[350px]">
              <div className="self-stretch flex flex-col items-start justify-start gap-[19px]">
                <div className="self-stretch rounded-xl bg-white flex flex-row flex-wrap items-start justify-start py-[17px] pr-[47px] pl-[15px] gap-[14px] border-[1px] border-solid border-gainsboro relative">
                  <div className="h-14 w-[317px] relative rounded-xl bg-white box-border hidden border-[1px] border-solid border-gainsboro"></div>
                  <img
                    className="h-[22px] w-[22px] relative z-[2]"
                    alt=""
                    src={img_40552aad6ec74046b568a2f212e9230e}
                  />

                  <input
                    className=" [border:none] [outline:none] bg-[transparent] flex-1 flex flex-col items-start justify-start pt-[3px] px-0 pb-[0.40000000000000036px] box-border font-airbnb-cereal-app text-sm text-slategray min-w-[142px] absolute left-0 top-0 w-full h-full pl-[50px] pr-[20px]"
                    placeholder="Full name"
                    type="text"
                    value={fullName.value}
                    onChange={(e) => fullName.set(e.target.value)}
                  />
                </div>
                <div className="self-stretch rounded-xl bg-white flex flex-row items-start justify-start py-[17px] px-[15px] gap-[14px] border-[1px] border-solid border-gainsboro relative">
                  <div className="h-14 w-[317px] relative rounded-xl bg-white box-border hidden border-[1px] border-solid border-gainsboro"></div>
                  <img
                    className="h-[22px] w-[22px] relative z-[2]"
                    alt=""
                    src={img_f35f8cae46bb465e9a4328f9dbdda9f5}
                  />

                  <input
                    className=" [border:none] [outline:none] bg-[transparent] flex-1 flex flex-col items-start justify-start pt-[3px] px-0 pb-[0.40000000000000036px] box-border font-airbnb-cereal-app text-sm text-slategray min-w-[142px] absolute left-0 top-0 w-full h-full pl-[50px] pr-[20px]"
                    placeholder="abc@email.com"
                    type="email"
                    value={email.value}
                    onChange={(e) => email.set(e.target.value)}
                  />
                </div>
                <div className="self-stretch rounded-xl bg-white flex flex-row flex-wrap items-start justify-start py-[17px] pr-[47px] pl-[15px] gap-[14px] border-[1px] border-solid border-gainsboro relative">
                  <div className="h-14 w-[317px] relative rounded-xl bg-white box-border hidden border-[1px] border-solid border-gainsboro"></div>
                  <img
                    className="h-[22px] w-[22px] relative z-[2]"
                    alt=""
                    src={img_c55319262d9b4ce7b5cf33ecee0be2fc}
                  />
                  <input
                    className=" [border:none] [outline:none] bg-[transparent] flex-1 flex flex-col items-start justify-start pt-[3px] px-0 pb-[0.40000000000000036px] box-border font-airbnb-cereal-app text-sm text-slategray min-w-[142px] absolute left-0 top-0 w-full h-full pl-[50px] pr-[20px]"
                    placeholder="Your password"
                    type="password"
                    value={password.value}
                    onChange={(e) => password.set(e.target.value)}
                  />
                </div>
                <div className="cursor-pointer py-[17px] pr-[47px] pl-[15px] bg-white self-stretch rounded-xl flex flex-row flex-wrap items-start justify-start gap-[14px] border-[1px] border-solid border-gainsboro relative">
                  <div className="h-14 w-[317px] relative rounded-xl bg-white box-border hidden border-[1px] border-solid border-gainsboro"></div>
                  <img
                    className="h-[22px] w-[22px] relative z-[2]"
                    alt=""
                    src={img_b653ae5a13194b8da9859c92c1c3164b}
                  />

                  <input
                    className=" [border:none] [outline:none] bg-[transparent] flex-1 flex flex-col items-start justify-start pt-[3px] px-0 pb-[0.40000000000000036px] box-border font-airbnb-cereal-app text-sm text-slategray min-w-[142px] absolute left-0 top-0 w-full h-full pl-[50px] pr-[20px]"
                    placeholder="Confirm password"
                    type="password"
                    value={confirmPassword.value}
                    onChange={(e) => confirmPassword.set(e.target.value)}
                  />
                </div>
              </div>
              <button
                className={`cursor-pointer [border:none] pt-[19px] pb-[18px] pr-[25px] pl-5 bg-[transparent] w-[271px] mx-[24px] flex flex-row items-center justify-center box-border relative bg-mediumslateblue rounded-xl shadow-lg ${
                  state === 'loading' ? 'opacity-50' : ''
                }`}
                type="submit"
                disabled={state === 'loading'}
              >
                <div className="relative text-base tracking-[1px] uppercase  font-airbnb-cereal-app text-white font-bold text-center z-[1]">
                  {state === 'loading' ? 'Loading...' : 'Sign up'}
                </div>
              </button>
            </div>
          </section>
          <section className="self-stretch flex flex-row items-start justify-start py-0">
            <div className="flex-1 flex flex-col items-center justify-start gap-[59px]">
              <div className="flex flex-col items-center justify-start relative">
                <div className="my-0 mx-[!important] text-base leading-[34px] font-bold font-airbnb-cereal-app  text-darkgray text-center">
                  OR
                </div>
                <div
                  className="flex-1 rounded-xl bg-white shadow-[15px_0px_30px_rgba(211,_212,_226,_0.25)] flex flex-row items-center justify-center py-[15px] pr-11 pl-[46px] gap-[17px] z-[1] cursor-pointer"
                  onClick={signUpWithGoogle}
                >
                  <img
                    className="h-[25.6px] w-[26px] relative min-h-[26px] z-[1]"
                    loading="eager"
                    alt=""
                    src={img_408ab2c844df46f692894b8e96d27b5e}
                  />

                  <div className="relative text-base leading-[25px] font-airbnb-cereal-app text-color-typography-title text-center z-[1]">
                    Login with Google
                  </div>
                </div>
              </div>
              <div className="relative text-[15px] leading-[25px] font-airbnb-cereal-app whitespace-pre-wrap text-center">
                <span className="text-color-typography-title">
                  Already have an account?{' '}
                </span>
                <Link to="/sign-in">
                  <span className="text-mediumslateblue">Signin</span>
                </Link>
              </div>
            </div>
          </section>
        </form>
        <IonToast
          isOpen={!!error}
          onDidDismiss={clearError}
          message={`Error: ${error}`}
          duration={3000}
          color="danger"
        />
        <IonToast
          isOpen={!!modal}
          onDidDismiss={() => setModal('')}
          message={modal}
          duration={3000}
          color="success"
        />
      </IonContent>
    </IonPage>
  );
}

export default Screen;
