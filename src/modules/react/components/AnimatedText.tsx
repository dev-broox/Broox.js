import React, { CSSProperties, useEffect } from 'react';
import gsap from 'gsap';

const AnimatedText = ({ show, value, initialTop, finalTop, fontSize, color }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(show) {
      gsap.set(ref.current, { css: { y: initialTop }});
      gsap.to(ref.current, { y: finalTop, duration: 1 });
    }
  }, [show]);

  if(show) {
    const style: CSSProperties = {
      position: 'absolute',
      top: 0,
      width: '100%',
      textAlign: 'center',
      color: color,
      fontSize: fontSize
    };
    return (
      <div ref={ref} style={style} className="animatedText">{value}</div>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  value: string,
  initialTop: number,
  finalTop: number,
  fontSize: string,
  color: string
}

export { AnimatedText };