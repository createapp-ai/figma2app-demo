import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/typography.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-loading-skeleton/dist/skeleton.css';
import './index.css';
import 'react-device-frameset/styles/marvel-devices.min.css';

import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { usePrevious } from '@uidotdev/usehooks';
import { useCallback, useEffect, useState } from 'react';
import { DeviceFrameset } from 'react-device-frameset';
import { Route } from 'react-router-dom';
import { isMobile } from 'is-mobile';

import { useUserId } from '~/auth';
import { AuthProvider } from '~/auth/AuthProvider';
import { screens, SplashScreen } from '~/screens';
import { Fade, OpenInGithub } from '~/ui';

setupIonicReact({
  swipeBackEnabled: false,
});

function App() {
  const { userId } = useUserId();
  const [showApp, setShowApp] = useState(false);

  const isAuthLoading =
    userId.state === 'default' || userId.state === 'silentlyLoading';

  const prevIsAuthLoading = usePrevious(isAuthLoading);

  const DemoWrapper = useCallback(
    ({ children }: { children: React.ReactNode }) =>
      isMobile() ? (
        children
      ) : (
        <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
          <DeviceFrameset device="iPhone 8 Plus" color="black">
            {children}
          </DeviceFrameset>
        </div>
      ),
    []
  );

  useEffect(() => {
    if (!showApp && prevIsAuthLoading && !isAuthLoading) {
      setShowApp(true);
    }
  }, [isAuthLoading, prevIsAuthLoading, showApp]);

  return (
    <DemoWrapper>
      <IonApp>
        <IonReactRouter>
          <AuthProvider>
            <IonRouterOutlet animated={false}>
              {screens.map((screen, index) => (
                <Route
                  key={index}
                  path={screen.path}
                  component={screen.component}
                  exact={!!screen.path}
                />
              ))}
            </IonRouterOutlet>
            <Fade show={!showApp} duration={500} minTimeBeforeExiting={500}>
              <Route render={() => <SplashScreen />} />
            </Fade>
          </AuthProvider>
        </IonReactRouter>
        <OpenInGithub />
      </IonApp>
    </DemoWrapper>
  );
}

export default App;
