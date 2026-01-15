import { useEffect } from 'react';
import { useLocation } from 'wouter';

const Offerta197Form = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation('/');
  }, [setLocation]);

  return null;
};

export default Offerta197Form;
