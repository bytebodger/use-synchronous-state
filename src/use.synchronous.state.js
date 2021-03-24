import { useState } from 'react';

export const useSynchronousState = initialValue => {
   const [value, updateValue] = useState(initialValue);
   
   let latestValue = value;
   
   const get = () => latestValue;
   
   const set = newValue => {
      latestValue = newValue;
      updateValue(newValue);
      return latestValue;
   };
   
   return [
      get,
      set,
   ];
}
