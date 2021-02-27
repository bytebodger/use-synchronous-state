import { useSynchronousState } from './use.synchronous.state';
import { useEffect, useState } from 'react';
import { render } from '@testing-library/react';

test('useHookWithState() does not set formIsValid to TRUE', () => {
   const useHookWithState = () => {
      const [firstFieldIsValid, setFirstFieldIsValid] = useState(false);
      const [secondFieldIsValid, setSecondFieldIsValid] = useState(false);
      const [formIsValid, setFormIsValid] = useState(false);
      
      const validateFirstField = (newValue = '') => {
         setFirstFieldIsValid(newValue !== '');
         validateForm();
      }
      
      const validateForm = () => setFormIsValid(firstFieldIsValid && secondFieldIsValid);
      
      const validateSecondField = (newValue = '') => {
         setSecondFieldIsValid(newValue !== '');
         validateForm();
      }

      return {
         formIsValid,
         validateFirstField,
         validateSecondField,
      };
   }
   const TestComponent = () => {
      const hookWithState = useHookWithState();
      useEffect(() => {
         hookWithState.validateFirstField('an acceptable value');
         hookWithState.validateSecondField('another acceptable value');
         expect(hookWithState.formIsValid).toEqual(false);
      }, []);
      return <></>;
   }
   render(<TestComponent/>);
})

test('useHookWithTrait() sets formIsValid to TRUE', () => {
   const useHookWithTrait = () => {
      const [firstFieldIsValid, setFirstFieldIsValid] = useSynchronousState(false);
      const [secondFieldIsValid, setSecondFieldIsValid] = useSynchronousState(false);
      const [formIsValid, setFormIsValid] = useSynchronousState(false);
      
      const validateFirstField = (newValue = '') => {
         setFirstFieldIsValid(newValue !== '');
         validateForm();
      }
      
      const validateForm = () => setFormIsValid(firstFieldIsValid() && secondFieldIsValid());
      
      const validateSecondField = (newValue = '') => {
         setSecondFieldIsValid(newValue !== '');
         validateForm();
      }
      
      return {
         formIsValid,
         validateFirstField,
         validateSecondField,
      };
   }
   const TestComponent = () => {
      const hookWithTrait = useHookWithTrait();
      useEffect(() => {
         hookWithTrait.validateFirstField('an acceptable value');
         hookWithTrait.validateSecondField('another acceptable value');
         expect(hookWithTrait.formIsValid()).toEqual(true);
      }, []);
      return <></>;
   }
   render(<TestComponent/>);
})
