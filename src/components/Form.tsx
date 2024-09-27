import React, { useEffect } from 'react'
import {
  Button,
  Card,
  FormControl,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { IState } from '../types';
import AppHook from '../hook/AppHook';
import { writeToLocalStorage } from '../utils';

/*
 * Form component
 * It will take input of the user and generate a token
 * input consists of:
 * 1. Client ID
 * 2. Client Secret
 * 3. Token Url
 * 4. Scope
 * 5. Grant Type
 * 
 * And Generate Token button will generate a token
 * Text Area with copy to clipboard button will show the generated token
*/

export default function Form() {
  const {
    loading,
    state,
    request = {} as IState,
    changeRequest,
    changeOptions,
    makeTokenRequest,
    saveTokenToCookie,
  } = AppHook();
  const [response, setResponse] = React.useState<string>();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting: ", request);
    makeTokenRequest().then((data) => {
      setResponse(JSON.stringify(data, null, 2));
    });
  }

  useEffect(() => {
    if (state.isValid) {
      writeToLocalStorage('token-generator', state as object);
    }
  }, [state]);

  const handleSaveTokenToCookie = () => {
    saveTokenToCookie();

    if (state?.options?.autoRefresh && state?.options?.expiresIn) {
      const x = setInterval(saveTokenToCookie, state?.options?.expiresIn * 1000);
      console.log('Setting interval: ', x);
    }
  };

  const fields: Array<{
    key: keyof IState;
    label: string,
    required?: boolean;
  }> = [
    { key: 'clientId', label: 'Client ID', required: true },
    { key: 'clientSecret', label: 'Client Secret', required: true },
    { key: 'accessTokenUrl', label: 'Access Token Url', required: true },
    { key: 'scope', label: 'Scope', required: false },
  ];

  return (
    <div style={{ width: '800px'}}>
      <form onSubmit={handleSubmit}>
        <FormControl style={{ marginTop: '20px', width: '100%', gap: '15px' }}>
          {fields.map((field) => (
            <div key={field.key}>
              <TextField
                id="outlined-basic"
                label={field.label}
                variant="outlined"
                fullWidth
                value={request[field.key]}
                onChange={changeRequest(field.key)}
                required={field.required}
              />
            </div>
          ))}
        </FormControl>

        <Button
          variant="contained"
          style={{ marginTop: '20px' }}
          fullWidth
          type='submit'
          disabled={loading}
        >
          Test Generate Token
        </Button>
      </form>

      {response && (
        <div>
          <hr />
          <Card style={{ marginTop: '10px', padding: '10px' }}>
            <Typography variant="h6">Generated Token</Typography>
            <TextField id="outlined-basic" variant="outlined" rows={7} multiline fullWidth disabled value={response}/>
            <Button variant="contained" style={{ marginTop: '10px' }}>Copy to Clipboard</Button>
          </Card>
        </div>
      )}
      {state.isValid && (
        <div>
          <FormControlLabel
            control={
              <Switch
                checked={state?.options?.autoRefresh}
                onChange={changeOptions('autoRefresh')}
                name="autoRefresh"
              />
            }
            label="Auto Refresh"
          />
          <Button
            variant="contained"
            style={{ marginTop: '10px' }}
            fullWidth
            onClick={handleSaveTokenToCookie}
          >
            Save Token To Cookie
          </Button>
        </div>
      )}
    </div>
  )
}
