import React, { CSSProperties, useEffect } from 'react';
import gsap from 'gsap';
import QRCode from 'qrcode';

const AnimatedQr = ({ url, show, initialTop, finalTop, width }: Props) => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if(show) {
      gsap.set(ref.current, { css: { y: initialTop }});
      QRCode.toCanvas(ref.current, url, { width: width }, (error: any) => {
        if(error) {
          console.log('Error generating QR');
        }
        console.log('QR generated');
        gsap.to(ref.current, { y: finalTop, duration: 1 });
      });
    }
  }, [show]);

  if(show) {
    const style: CSSProperties = {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translate(-50%, 0)'
    };
    return (
      <canvas ref={ref} style={style} className="animatedQr"></canvas>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  url: string,
  initialTop: number,
  finalTop: number,
  width: number
}

export { AnimatedQr };