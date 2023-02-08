import React, { useEffect, useState, useRef } from 'react';

const RollingNumber = ({ value, to }: Props) => {
  const [number, setNumber] = useState(value);
  const numberRef = useRef(value);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if(intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    const factor = to > number ? 1 : -1;
    if(to !== number) {
      intervalRef.current = setInterval(() => {
        numberRef.current = numberRef.current + 1 * factor;
        if((factor == 1 && numberRef.current >= to) || factor === -1 && numberRef.current <= to) {
          clearInterval(intervalRef.current);
        }
        setNumber(numberRef.current);
      }, 20);
    }
  }, [ to ]);

  return (
    <div className="rollingNumber">{number}</div>
  );
}

interface Props {
  value: number,
  to: number
}

export { RollingNumber };