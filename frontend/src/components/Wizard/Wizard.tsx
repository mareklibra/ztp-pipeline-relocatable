import React from 'react';
import { Routes, Route } from 'react-router';

import {
  WelcomePage,
  UsernamePage,
  PasswordPage,
  ApiAddressPage,
  IngressIpPage,
  DomainPage,
} from '../../components';
import Redirect from '../../Redirect';
import { WizardProgressContextProvider } from '../WizardProgress';
import { SshPublicKeyPage } from '../SshPublicKeyPage';

import { useWizardState } from './wizardState';

import './Wizard.css';

export const Wizard: React.FC = () => {
  const wizardState = useWizardState();

  return (
    <WizardProgressContextProvider state={wizardState}>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/username" element={<UsernamePage />} />
        <Route path="/password" element={<PasswordPage />} />
        <Route path="/apiaddr" element={<ApiAddressPage />} />
        <Route path="/ingressip" element={<IngressIpPage />} />
        <Route path="/domain" element={<DomainPage />} />
        <Route path="/sshkey" element={<SshPublicKeyPage />} />
        <Route path="/persist" element={/*<PersistPage />*/ <WelcomePage />} />
        <Route path="*" element={<Redirect to="/wizard/welcome" />} />
      </Routes>
    </WizardProgressContextProvider>
  );
};