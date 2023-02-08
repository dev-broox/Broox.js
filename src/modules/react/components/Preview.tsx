import React, { CSSProperties, useEffect } from 'react';
import gsap from 'gsap';
import { PreviewType } from '../model/PreviewType';

const Preview = ({ show, type, src, scale, initialTop, finalTop }: Props) => {
  const ref = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    if(show) {
      gsap.set(ref.current, {
        css: { scale: scale, y: initialTop, rotation: 60 }
      });
      gsap.to(ref.current, { rotation: -3, x: -25, y: finalTop, duration: 1 });
    }
  }, [show]);

  if(show) {
    const style: CSSProperties = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%'
    };
    return (
      <div ref={ref} style={style} className="preview">
        {type === PreviewType.video ? 
          <video src={src} autoPlay={true} loop={true} /> :
          <img src={src} />}
      </div>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  type: PreviewType,
  src: string,
  scale: number,
  initialTop: number,
  finalTop: number
}

export { Preview };