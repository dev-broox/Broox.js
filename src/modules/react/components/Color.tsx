import React, { CSSProperties } from 'react';

const Color = ({ show, color, width, height, top, left }: Props) => {
  const style: CSSProperties = {
    position: 'absolute',
    width: width || '100%',
    height: height || '100%',
    top: top || 0,
    left: left || 0,
    display: show ? 'block' : 'none',
    backgroundColor: color
  };
  return (
    <div style={style} className="color" />
  );
}

interface Props {
  show: boolean,
  color: string,
  width?: number,
  height?: number,
  top?: number,
  left?: number
}

export { Color };