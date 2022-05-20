import { FormGroupProps } from '@patternfly/react-core';
import { DNS_NAME_REGEX, USERNAME_REGEX } from '../backend-shared';
import { TlsCertificate } from '../copy-backend-common';
import { isPasswordPolicyMet } from './PasswordPage/utils';
import { IpTripletSelectorValidationType, K8SStateContextData } from './types';

export const addIpDots = (addressWithoutDots: string): string => {
  if (addressWithoutDots?.length === 12) {
    let address = addressWithoutDots.substring(0, 3).trim() + '.';
    address += addressWithoutDots.substring(3, 6).trim() + '.';
    address += addressWithoutDots.substring(6, 9).trim() + '.';
    address += addressWithoutDots.substring(9).trim();

    return address;
  }

  throw new Error('Invalid address: ' + addressWithoutDots);
};

export const ipTripletAddressValidator = (addr: string): IpTripletSelectorValidationType => {
  const validation: IpTripletSelectorValidationType = { valid: true, triplets: [] };

  for (let i = 0; i <= 3; i++) {
    const triplet = addr.substring(i * 3, (i + 1) * 3).trim();
    const num = parseInt(triplet);
    const valid = num > 0 && num < 256;

    validation.valid = validation.valid && valid;
    validation.triplets.push(valid ? 'success' : 'default');
  }

  if (!validation.valid) {
    validation.message = 'Provided IP address is incorrect.';
  }
  return validation;
};

export const domainValidator = (domain: string): K8SStateContextData['domainValidation'] => {
  if (!domain || domain?.match(DNS_NAME_REGEX)) {
    return ''; // passed ; optional - pass for empty as well
  }
  return "Valid domain wasn't provided.";
};

export const usernameValidator = (username = ''): K8SStateContextData['username'] => {
  if (username.length >= 54) {
    return 'Valid username can not be longer than 54 characters.';
  }

  if (username === 'kubeadmin') {
    return 'The kubeadmin username is reserved.';
  }

  if (!username || username.match(USERNAME_REGEX)) {
    return ''; // passed
  }

  return "Valid username wasn't provided.";
};

export const passwordValidator = (pwd: string): K8SStateContextData['passwordValidation'] => {
  return isPasswordPolicyMet(pwd);
};

export const customCertsValidator = (
  oldValidation: K8SStateContextData['customCertsValidation'],
  domain: string,
  certificate: TlsCertificate,
): K8SStateContextData['customCertsValidation'] => {
  const validation: K8SStateContextData['customCertsValidation'] = { ...oldValidation };

  let certValidated: FormGroupProps['validated'] = 'default';
  let certLabelHelperText = '';
  let certLabelInvalid = '';
  if (!certificate?.['tls.crt'] && certificate?.['tls.key']) {
    certValidated = 'error';
    certLabelInvalid = 'Both key and certificate must be provided at once.';
  } else if (!certificate?.['tls.crt']) {
    certLabelHelperText =
      'When not uploaded, a self-signed certificate will be generated automatically.';
  }

  let keyValidated: FormGroupProps['validated'] = 'default';
  let keyLabelInvalid = '';
  if (certificate?.['tls.crt'] && !certificate?.['tls.key']) {
    keyValidated = 'error';
    keyLabelInvalid = 'Both key and certificate must be provided at once.';
  }

  if (certificate?.['tls.crt'] && certificate?.['tls.key']) {
    // TODO: more in-depth content check??
    // -----BEGIN CERTIFICATE-----
    // -----BEGIN PRIVATE KEY-----
    certValidated = 'success';
    keyValidated = 'success';
  }

  validation[domain] = {
    certValidated,
    certLabelHelperText,
    certLabelInvalid,

    keyValidated,
    keyLabelInvalid,
  };

  return validation;
};

export const ipWithoutDots = (ip?: string): string => {
  if (ip) {
    const triplets = ip.split('.');
    if (triplets.length === 4) {
      let result = triplets[0].padStart(3, ' ');
      result += triplets[1].padStart(3, ' ');
      result += triplets[2].padStart(3, ' ');
      result += triplets[3].padStart(3, ' ');
      return result;
    }
  }

  console.info('Unrecognized ip address format "', ip, '"');
  return '            '; // 12 characters
};

export const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const getZtpfwUrl = () => `https://${window.location.hostname}:${window.location.port}`;
