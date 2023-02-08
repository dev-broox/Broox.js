import React, { CSSProperties } from 'react';

const Text = ({ show, value, width, top, left, fontSize, color }: Props) => {
  if(show) {
    const style: CSSProperties = {
      position: 'absolute',
      left: left || 0,
      top: top || 0,
      width: width || '100%',
      textAlign: 'center',
      color: color,
      fontSize: fontSize
    };
    return (
      <div style={style} className="text">{value}</div>
    );
  }
  return null;
}

interface Props {
  show: boolean,
  value: string,
  width?: number,
  top?: number,
  left?: number,
  fontSize: string,
  color: string
}

export { Text };