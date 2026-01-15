import { useEffect } from 'react';
import { useLocation } from 'wouter';

const Offerta197 = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation('/');
  }, [setLocation]);

  return null;
};

export default Offerta197;
