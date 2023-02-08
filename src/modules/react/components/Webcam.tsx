import React, { CSSProperties, useEffect } from 'react';
import { getAvailableDevices, startDevice, getDeviceId } from '../../media/Stream';

const Webcam = ({ webcamId, webcamName, webcamWidth, webcamHeight, onSetElement }: Props) => {
  const ref = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getAvailableDevices().then((d: any) => console.log(d));
    getStream().then((stream: any) => {
      if(ref.current) {
        console.log('Starting webcam');
        ref.current.srcObject = stream;
        onSetElement(ref.current);
      }
    });
  }, []);

  // get stream from id if defined or name otherwise
  const getStream = async (): Promise<MediaStream> => {
    if(webcamId) {
      return await startDevice(webcamId, webcamWidth, webcamHeight);
    }
    else {
      const id = await getDeviceId(webcamName);
      console.log('Webcam id', id);
      return await startDevice(id, webcamWidth, webcamHeight);
    }
  }

  const style: CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
  return (
    <video ref={ref} style={style} autoPlay={true} className="webcam"></video>
  );
}

interface Props {
  webcamId?: string,
  webcamName: string,
  webcamWidth: number,
  webcamHeight: number,
  onSetElement: (element: any) => void
}

export { Webcam };