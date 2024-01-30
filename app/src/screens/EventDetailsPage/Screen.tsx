import { IonContent, IonHeader, IonPage, IonToast } from '@ionic/react';
import { format } from 'date-fns';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';

import {
  img_8c12c4e57ab6434f8a80c9e0ef5e5ddd,
  img_86feabbf58704d9a895b02fd6a3caa06,
  img_7616f7af898b4f2fb9be42d2e5548cac,
} from '~/assets';

import { useBuyTicket, useLoadData } from './hooks';

function Screen() {
  const { event } = useLoadData();
  const { buyTicket, ticket, isReady, error } = useBuyTicket();
  const history = useHistory();

  const canBuyTicket =
    event.state === 'hasData' && !event.data.hasAlreadyJoined && isReady;

  return (
    <IonPage>
      <IonHeader>
        <div
          className="flex flex-row items-center justify-start px-6 bg-white  w-full h-[80px] cursor-pointer"
          onClick={() => history.replace('/')}
        >
          <div className="flex flex-row items-center justify-start gap-[20px] text-xl">
            <img
              className="h-[22px] w-[22px]"
              loading="eager"
              alt=""
              src={img_86feabbf58704d9a895b02fd6a3caa06}
            />

            <h3 className="m-0 relative text-inherit font-medium font-inherit inline-block">
              Event Details
            </h3>
          </div>
        </div>
      </IonHeader>
      <IonContent fullscreen>
        <div className="relative bg-white flex flex-col items-center justify-start px-0 pb-[21px] box-border gap-[50px]">
          <section className="self-stretch flex flex-col items-start justify-start gap-[24px] text-left text-[24px] text-color-typography-title font-airbnb-cereal-app cursor-pointer">
            <div className="self-stretch flex flex-row items-start justify-start relative">
              {event.state === 'hasData' ? (
                <div className="h-[185px] w-full overflow-hidden flex justify-center items-center">
                  <LazyLoadImage
                    className="w-full h-auto object-cover"
                    alt=""
                    src={event.data.thumbnail}
                    effect="opacity"
                    width="100%"
                    placeholder={<Skeleton width="100vw" height={185} />}
                  />
                </div>
              ) : (
                <Skeleton width="100vw" height={185} />
              )}
              {event.state === 'hasData' && event.data.avatars.length > 0 && (
                <div className="[border:none] p-[10px] bg-gray-100 my-0 mx-[!important] absolute bottom-[-29px] left-[50%] transform translate-x-[-50%] rounded-[30px] shadow-[0px_20px_20px_rgba(90,_90,_90,_0.1)] [backdrop-filter:blur(21.75px)] flex flex-row items-center justify-start box-border gap-[9px] z-[1]">
                  <div
                    className="h-[34.2px]"
                    style={{
                      width: `${(event.data.avatars.length - 1) * 22 + 34.2}px`,
                    }}
                  />
                  {event.data.avatars.map((avatar, index) => {
                    return (
                      <div
                        className="absolute h-[34.2px] w-[34.2px]"
                        key={index}
                      >
                        <LazyLoadImage
                          className="z-[1] rounded-full border-white border-solid border-[1px]"
                          style={{ transform: `translateX(${index * 22}px)` }}
                          alt=""
                          src={avatar}
                          effect="opacity"
                          placeholder={<Skeleton width={34} height={34} />}
                        />
                      </div>
                    );
                  })}
                  {event.data.numberOfUsers - event.data.avatars.length > 0 && (
                    <div className="flex-1 relative text-sm font-medium font-airbnbcereal_w_bd text-blueviolet text-left flex items-center z-[1] h-[34.2px] mr-[5px]">
                      {event.data.numberOfUsers - event.data.avatars.length}+
                      going
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
          <section className="w-[364px] flex flex-row items-start justify-start py-0 px-2.5 box-border text-left text-base text-color-typography-title font-airbnb-cereal-app pb-[100px]">
            <div className="flex-1 flex flex-col items-start justify-start gap-[18px]">
              <div className="w-[319px] flex flex-row items-start justify-start py-0 px-[3px] box-border text-[35px] font-airbnbcereal_w_bd">
                <h1 className="m-0 flex-1 relative text-inherit font-normal font-inherit inline-block">
                  {event.state === 'hasData' ? (
                    event.data.title
                  ) : (
                    <Skeleton count={2} />
                  )}
                </h1>
              </div>
              <div className="h-[188px] flex flex-col items-start justify-start py-0 pr-5 pl-0 box-border gap-[15px]">
                <div className="h-[53px] flex flex-row items-end justify-start gap-[14px]">
                  <img
                    className="h-12 w-12 relative object-cover"
                    loading="eager"
                    alt=""
                    src={img_7616f7af898b4f2fb9be42d2e5548cac}
                  />

                  <div className="flex flex-col items-start justify-start gap-[1px]">
                    <div className="relative leading-[34px] font-medium opacity-[0.84] mix-blend-normal font-airbnbcereal_w_bd">
                      {event.state === 'hasData' ? (
                        format(new Date(event.data.date.begin), 'dd MMMM, yyyy')
                      ) : (
                        <Skeleton width={100} />
                      )}
                    </div>
                    <div className="relative text-xs text-slategray mix-blend-normal">
                      {event.state === 'hasData' ? (
                        `${format(
                          new Date(event.data.date.begin),
                          'EEEE, h:mmaaa'
                        )} - ${format(
                          new Date(event.data.date.end),
                          'h:mmaaa'
                        )}`
                      ) : (
                        <Skeleton width={150} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="h-[53px] flex flex-row items-end justify-start gap-[14px]">
                  <img
                    className="h-12 w-12 relative object-cover"
                    loading="eager"
                    alt=""
                    src={img_8c12c4e57ab6434f8a80c9e0ef5e5ddd}
                  />

                  <div className="flex flex-col items-start justify-start gap-[1px]">
                    <div className="relative leading-[34px] font-medium opacity-[0.84] mix-blend-normal font-airbnbcereal_w_bd">
                      {event.state === 'hasData' ? (
                        event.data.location
                      ) : (
                        <Skeleton width={50} />
                      )}
                    </div>
                    <div className="relative text-xs text-slategray mix-blend-normal">
                      {event.state === 'hasData' ? (
                        event.data.address
                      ) : (
                        <Skeleton width={230} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-[185px] flex flex-row items-start justify-start py-0 px-[3px] box-border text-sm">
                  <div className="flex-1 flex flex-row items-start justify-start gap-[13px]">
                    {event.state === 'hasData' ? (
                      <LazyLoadImage
                        className="h-11 w-11 relative object-cover rounded-xl"
                        loading="eager"
                        alt=""
                        src={event.data.organizer.avatar}
                        effect="opacity"
                        placeholder={<Skeleton width={44} height={44} />}
                      />
                    ) : (
                      <Skeleton width={44} height={44} borderRadius={12} />
                    )}
                    <div className="flex-1 flex flex-col items-start justify-start">
                      <div className="self-stretch relative leading-[25px] mix-blend-normal">
                        {event.state === 'hasData' ? (
                          event.data.organizer.nickname
                        ) : (
                          <Skeleton width={60} />
                        )}
                      </div>
                      <div className="w-[101px] relative text-xs text-slategray flex items-center mix-blend-normal z-[1]">
                        Organizer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <footer className="self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-[9px] box-border min-h-[73px] text-left text-[18px] text-color-typography-title font-airbnb-cereal-app">
                <div className="flex-1 flex flex-col items-start justify-start gap-[8px]">
                  <div className="relative leading-[34px] flex items-center opacity-[0.84] mix-blend-normal pr-5 font-bold">
                    About Event
                  </div>
                  <div className="self-stretch relative text-base leading-[28px] font-airbnbcereal_w_bk">
                    {event.state === 'hasData' ? (
                      event.data.description
                    ) : (
                      <Skeleton count={8} />
                    )}
                  </div>
                </div>
              </footer>
            </div>
          </section>
          {event.state === 'hasData' && (isReady || !error) && (
            <div className="flex flex-row items-start justify-center py-0 px-[31px] text-center  w-full fixed bottom-[21px] left-[50%] translate-x-[-50%] z-[10] bg-transparent">
              <button
                className={`flex flex-row items-center justify-center pt-[19px] pb-[18px] relative rounded-[15px] shadow-lg w-[270px] hover:bg-[#b3bbff] text-white ${
                  canBuyTicket ? 'bg-mediumslateblue' : 'bg-[#b3bbff]'
                }`}
                onClick={buyTicket}
                disabled={!canBuyTicket}
                type="button"
              >
                <div className="relative tracking-[1px] uppercase font-medium z-[1]">
                  {ticket.state === 'loading'
                    ? 'Buying in progress...'
                    : !isReady
                    ? 'Preparing Payment...'
                    : event.data.hasAlreadyJoined
                    ? 'Already Joined'
                    : `Buy Ticket $${event.data.price}`}
                </div>
              </button>
            </div>
          )}
        </div>
        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
}

export default Screen;
