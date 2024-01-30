import { IonContent, IonPage } from '@ionic/react';

import { splashIcon } from '~/assets';

function SplashScreen() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="w-full h-full flex items-center justify-center">
          <img src={splashIcon} alt="splash" />
        </div>
      </IonContent>
    </IonPage>
  );
}

export default SplashScreen;
