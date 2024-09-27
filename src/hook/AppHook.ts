import React from 'react'
import { AppContext } from '../context/AppContext'
import { IOptions, IState, TStatus } from '../types';

export default function AppHook() {
  const [state, setState] = React.useContext(AppContext);

  const setStatus = (status: TStatus) => {
    setState((prevState) => ({ ...prevState, status }));
  };

  const makeTokenRequest = async () => {
    setStatus('loading');
    return fetch('/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state?.request),
    }).then((res) => res.json())
      .then((data) => {
        console.log('token response: ', data);
        setState((prevState) => {
          let newState = { ...prevState };
          newState.status = 'success';
          newState.token = data.access_token;
          newState.isValid = true;

          if (data?.expires_in) {
            newState = {
              ...newState,
              options: {
                ...newState?.options,
                expiresIn: data.expires_in,
              } as IOptions,
            }
          }

          return newState;
        });
        return data;
      })
      .catch((err) => {
        console.error('Error: ', err);
        setStatus('error');
      });
  };

  const saveTokenToCookie = async () => {
    const data = await makeTokenRequest();
    data.expires_in = 1;
    console.log('getting token', new Date(), 'expires in', data?.expires_in, 'next refresh at ', new Date(Date.now() + (data?.expires_in) * 1000));
    if (data?.access_token) {
      document.cookie = `${state?.options?.cookieName}=${data.access_token}; expires=${new Date(Date.now() + (state.options.expiresIn) * 1000).toUTCString()}`;
    }
  }
  const changeRequest = (key: keyof IState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => {
      const newState = { ...prevState };
      newState.request = {
        ...newState.request,
        [key]: e.target.value,
      } as IState;

      newState.isValid = false;
      return newState;
    });
  }

  const changeOptions = (key: keyof IOptions) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => {
      const newState = { ...prevState };
      newState.options = {
        ...newState.options,
        [key]: e.target.checked,
      } as IOptions;

      return newState;
    });
  }

  return {
    loading: state.status === 'loading',
    state,
    makeTokenRequest,
    saveTokenToCookie,

    request: state.request,
    changeRequest,
    changeOptions,
  }
};
