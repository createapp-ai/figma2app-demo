import { IonActionSheet, IonContent, IonPage } from '@ionic/react';
import { format } from 'date-fns';
import { useAtom } from 'jotai';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import { pinIcon } from '~/assets';

import { useLoadData, useLocationSelection } from './hooks';
import { isDropdownOpenAtom } from './states';

function HomeScreen() {
  const { events, upcomingEvents, selectedState } = useLoadData();
  const { availableStates, selectState } = useLocationSelection();
  const [isDropdownOpen, setIsDropdownOpen] = useAtom(isDropdownOpenAtom);

  return (
    <IonPage>
      <IonContent>
        <div className="w-full relative bg-white overflow-hidden flex flex-col items-start justify-start pt-0 px-0 pb-[40px] box-border gap-[33px]">
          <IonActionSheet
            isOpen={isDropdownOpen}
            onWillDismiss={() => setIsDropdownOpen(false)}
            header={
              availableStates.state === 'loading'
                ? 'Loading...'
                : availableStates.state === 'hasError'
                ? 'Failed to load locations'
                : 'Select your location'
            }
            buttons={
              availableStates.state === 'hasData'
                ? availableStates.data.map((state) => ({
                    text: state,
                    handler: () => {
                      selectState(state);
                      setIsDropdownOpen(false);
                    },
                  }))
                : []
            }
          />
          <button
            className="self-stretch bg-blueviolet flex flex-col items-center justify-start pt-[25px] pb-[15px] pr-[23px] pl-5 gap-[2px] text-center text-xs text-white font-airbnbcereal_w_bd cursor-pointer"
            disabled={
              isDropdownOpen ||
              selectedState.state === 'loading' ||
              selectedState.state === 'default'
            }
            onClick={() => setIsDropdownOpen(true)}
          >
            <div className="w-[375px] relative bg-blueviolet h-[75px] hidden"></div>
            <div className="relative opacity-[0.7] z-[1]">
              Selected Location
            </div>
            <div className="relative text-smi font-airbnbcereal_w_bk text-ghostwhite mix-blend-normal z-[1]">
              {selectedState.state === 'hasData' && selectedState.data}
              {(selectedState.state === 'loading' ||
                selectedState.state === 'default') &&
                'Loading...'}
              {selectedState.state === 'hasError' &&
                'Failed to load your location'}
            </div>
          </button>
          <section className="flex flex-row items-start justify-start py-0 box-border text-left text-lg text-color-typography-title font-airbnb-cereal-app w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[25px] w-full">
              <h3 className="m-0 relative text-inherit leading-[34px] font-bold font-inherit opacity-[0.84] mix-blend-normal px-6">
                Upcoming Events
              </h3>
              <div className="self-stretch flex-1 flex flex-row items-center py-0  pl-[33px] pb-3 text-black w-full overflow-x-scroll">
                {upcomingEvents.state === 'hasData' &&
                upcomingEvents.data.length > 0 ? (
                  upcomingEvents.data.map((event) => (
                    <Link
                      to={`/event/${event.id}`}
                      key={event.id}
                      className="no-underline"
                    >
                      <div className="self-stretch flex-1 flex flex-col items-start justify-start gap-[9px] w-[220px] mr-[30px] cursor-pointer">
                        <LazyLoadImage
                          className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover rounded-md"
                          loading="eager"
                          alt=""
                          src={event.thumbnail}
                          placeholder={<Skeleton width={220} height={130} />}
                          effect="opacity"
                          width={220}
                          height={130}
                        />

                        <h3 className="m-0 font-inherit text-ellipsis overflow-hidden text-nowrap whitespace-nowrap w-full text-base text-black font-medium">
                          {event.title}
                        </h3>

                        <div className="flex flex-row items-start justify-start py-0 px-[7px] text-xs text-blueviolet-200">
                          <div className="flex flex-row items-center justify-start relative gap-[9px]">
                            <div
                              className="h-[34.2px]"
                              style={{
                                width: `${
                                  (event.avatars.length - 1) * 22 + 34.2
                                }px`,
                              }}
                            />
                            {event.avatars.map((avatar, index) => {
                              return (
                                <div
                                  className="absolute h-[34.2px] w-[34.2px]"
                                  key={index}
                                >
                                  <LazyLoadImage
                                    className="z-[1] rounded-full border-white border-solid border-[1px]"
                                    style={{
                                      transform: `translateX(${index * 22}px)`,
                                    }}
                                    placeholder={
                                      <Skeleton circle width={34} height={34} />
                                    }
                                    alt=""
                                    src={avatar}
                                    effect="opacity"
                                  />
                                </div>
                              );
                            })}

                            {event.totalUsers - event.avatars.length > 0 && (
                              <div className="flex-1 relative text-sm font-medium text-blueviolet text-left flex items-center z-[1] h-[34.2px]">
                                {`+${
                                  event.totalUsers - event.avatars.length
                                } going`}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row items-start justify-start py-0 text-sm text-slategray font-airbnbcereal_w_bd w-full">
                          <div className="flex flex-row items-center justify-start gap-[5px] w-full">
                            <img
                              className="h-4 w-4 relative"
                              alt=""
                              src={pinIcon}
                            />

                            <div className="text-ellipsis overflow-hidden text-nowrap w-full whitespace-nowrap font-airbnbcereal_w_bd">
                              {event.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : upcomingEvents.state === 'loading' ||
                  upcomingEvents.state === 'default' ? (
                  [...new Array(3)].map((_, index) => (
                    <div className="self-stretch flex-1 flex flex-col items-start justify-start gap-[9px] w-[220px] mr-[30px]">
                      <Skeleton
                        width={220}
                        height={130}
                        className="rounded-md"
                      />

                      <h3 className="m-0 font-inherit text-ellipsis overflow-hidden text-nowrap w-full text-base text-black font-bold">
                        <Skeleton width="100%" />
                      </h3>

                      <div className="flex flex-row items-start justify-start py-0 text-xs text-blueviolet-200 w-full">
                        <div className="relative gap-[9px] w-full">
                          <Skeleton width="70%" height={28} />
                        </div>
                      </div>
                      <div className="flex flex-row items-start justify-start py-0 text-sm text-slategray font-airbnbcereal_w_bd w-full">
                        <div className="flex flex-row items-center justify-start gap-[5px] w-full">
                          <img
                            className="h-4 w-4 relative"
                            alt=""
                            src={pinIcon}
                          />
                          <div className="text-ellipsis overflow-hidden text-nowrap w-full whitespace-nowrap">
                            <Skeleton width="100%" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <section className="w-[275px] flex flex-row items-start justify-start py-0 box-border text-left text-lg text-color-typography-title font-airbnb-cereal-app">
                    <p className="ml-6 text-slategray text-sm">
                      {upcomingEvents.state === 'hasError' &&
                        'Failed to load nearby events'}
                      {upcomingEvents.state === 'hasData' &&
                        upcomingEvents.data.length === 0 &&
                        'No upcoming events'}
                    </p>
                  </section>
                )}
              </div>
            </div>
          </section>
          <section className="self-stretch flex flex-row items-start justify-start py-0 px-[21px] text-left text-lg text-color-typography-title font-airbnb-cereal-app">
            <div className="flex-1 flex flex-col items-start justify-start gap-[26px]">
              <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-[3px]">
                <div className="flex-1 flex flex-col items-start justify-start gap-[8px]">
                  <h3 className="m-0 relative text-inherit leading-[34px] font-bold font-inherit opacity-[0.84] mix-blend-normal">
                    Nearby You
                  </h3>
                  {events.state === 'hasData' && events.data.length > 0 ? (
                    events.data.map((event) => (
                      <Link
                        to={`/event/${event.id}`}
                        key={event.id}
                        className="no-underline"
                      >
                        <div className="self-stretch rounded-lg bg-white shadow-[0px_8px_30px_rgba(80,_85,_136,_0.06)] flex flex-row items-end justify-start py-2.5 pr-[29px] pl-2.5 gap-[18px] text-xs text-color-primary-blue mb-[10px] w-[327px]">
                          <LazyLoadImage
                            className="h-[90.6px] min-w-[79px] relative object-cover z-[1] rounded-[10px]"
                            alt=""
                            src={event.thumbnail}
                            placeholder={<Skeleton width={79} height={90.6} />}
                            effect="opacity"
                            width={79}
                            height={90.6}
                          />

                          <div className="h-[85px] flex flex-col items-start justify-start gap-[6px] w-full overflow-hidden">
                            <div className="relative uppercase font-medium whitespace-pre-wrap z-[1]">
                              {format(new Date(event.date), 'do MMM- EEE')}
                              {format(new Date(event.beginHours), '-p')}
                            </div>
                            <div className="self-stretch relative text-[15px] font-medium text-color-typography-title z-[1]">
                              {event.title}
                            </div>
                            <div className="flex flex-row items-end justify-start gap-[6px] text-smi text-slategray font-airbnb-cereal-app w-full">
                              <img
                                className="h-4 w-4 relative"
                                loading="eager"
                                alt=""
                                src={pinIcon}
                              />

                              <div className="text-ellipsis overflow-hidden text-nowrap w-full whitespace-nowrap font-airbnbcereal_w_bd">
                                {event.address}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : events.state === 'loading' ||
                    events.state === 'default' ? (
                    [...new Array(3)].map((_, index) => (
                      <div className="self-stretch rounded-lg bg-white shadow-[0px_8px_30px_rgba(80,_85,_136,_0.06)] flex flex-row items-end justify-start py-2.5 pr-[29px] pl-2.5 gap-[18px] text-xs text-color-primary-blue mb-[10px] w-[327px]">
                        <Skeleton
                          width={79}
                          height={90.6}
                          className="rounded-[10px]"
                        />
                        <div className="h-[85px] flex flex-col items-start justify-start gap-[6px] w-full overflow-hidden">
                          <div className="relative uppercase font-medium whitespace-pre-wrap z-[1] w-full">
                            <Skeleton width="100%" />
                          </div>
                          <div className="self-stretch relative text-[15px] font-bold text-color-typography-title z-[1]">
                            <Skeleton width="100%" />
                          </div>
                          <div className="flex flex-row items-end justify-start gap-[6px] text-smi text-slategray font-airbnb-cereal-app w-full">
                            <img
                              className="h-4 w-4 relative"
                              loading="eager"
                              alt=""
                              src={pinIcon}
                            />

                            <div className="text-ellipsis overflow-hidden text-nowrap w-full whitespace-nowrap">
                              <Skeleton width="100%" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <section className="w-[275px] flex flex-row items-start justify-start py-0 box-border text-left text-lg text-color-typography-title font-airbnb-cereal-app">
                      <p className="ml-6 text-slategray text-sm">
                        {events.state === 'hasError' &&
                          'Failed to load nearby events'}
                        {events.state === 'hasData' &&
                          events.data.length === 0 &&
                          'No nearby events'}
                      </p>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default HomeScreen;
