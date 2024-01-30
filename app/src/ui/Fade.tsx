import React, { useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';

interface Props {
  children: React.ReactNode | React.ReactNode[];
  show: boolean;
  minTimeBeforeExiting?: number;
  styles?: {
    entering?: React.CSSProperties;
    entered?: React.CSSProperties;
    exiting?: React.CSSProperties;
    exited?: React.CSSProperties;
    unmounted?: React.CSSProperties;
  };
  duration?: number;
  onEnter?: CSSTransitionProps['onEnter'];
  onEntering?: CSSTransitionProps['onEntering'];
  onEntered?: CSSTransitionProps['onEntered'];
  onExit?: CSSTransitionProps['onExit'];
  onExiting?: CSSTransitionProps['onExiting'];
  onExited?: CSSTransitionProps['onExited'];
}

function Fade({
  show,
  children,
  minTimeBeforeExiting = 0,
  styles: propsStyles = {
    entering: {},
    entered: {},
    exiting: {},
    exited: {},
    unmounted: {},
  },
  duration = 700,
  ...props
}: Props) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShouldRender(false);
    }, minTimeBeforeExiting);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [minTimeBeforeExiting]);

  const styles = {
    entering: {
      opacity: 1,
      ...propsStyles.entering,
    },
    entered: {
      opacity: 1,
      ...propsStyles.entered,
    },
    exiting: {
      opacity: 0,
      ...propsStyles.exiting,
    },
    exited: {
      opacity: 0,
      ...propsStyles.exited,
    },
    unmounted: propsStyles.unmounted,
  };

  return (
    <Transition
      in={show || shouldRender}
      timeout={duration}
      unmountOnExit
      {...props}
    >
      {(state) => (
        <div
          style={{
            transitionDuration: `${duration}ms`,
            transitionProperty: 'opacity',
            transitionTimingFunction: 'ease-out',
            opacity: 0,
            ...styles[state],
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
}

export default Fade;
