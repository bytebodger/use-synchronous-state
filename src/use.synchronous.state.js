import { useState } from 'react';
import { clone } from '@toolz/clone';
import { isARegularObject } from '@toolz/is-a-regular-object-react';

export const useSynchronousState = initialValue => {
   const [value, updateValue] = useState(initialValue);
   
   let latestValue = value;
   
   const get = () => latestValue;
   
   const set = newValue => {
      if (Array.isArray(newValue))
         latestValue = clone.array(newValue);
      else if (isARegularObject(newValue))
         latestValue = clone.object(newValue);
      else
         latestValue = newValue;
      updateValue(newValue);
      return latestValue;
   };
   
   return [
      get,
      set,
   ];
}
