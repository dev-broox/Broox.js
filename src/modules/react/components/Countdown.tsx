import React, { CSSProperties, useEffect, useState } from 'react';

const Countdown = ({ show, totalTime, onComplete }: Props) => {
  const [time, setTime] = useState(totalTime);

  useEffect(() => {
    if(show) {
      setTime(totalTime);
      tick(totalTime);
    }
  }, [show]);
  
  const tick = (t: number) => {
    setTimeout(() => {
      if(t > 1){
        setTime(t - 1);
        tick(t - 1);
      }
      else {
        onComplete();
      }
    }, 1000)
  }
  
  if(show) {
    const style: CSSProperties = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      fontFamily: 'Arial, Helvetica, sans-serif'
    };
    const smallStyle: CSSProperties = {
      position: 'absolute',
      color: 'white',
      fontSize: '84px',
      right: '40px',
      bottom: '20px',
      opacity: 1
    };
    return (
      <div style={style} className="countdown">
        <span style={smallStyle}>{time}</span>
      </div>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  totalTime: number,
  onComplete: () => void
}

export { Countdown };