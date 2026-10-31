/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { LoginView } from './components/auth/LoginView';
import { AppShell } from './components/shell/AppShell';
import { CommandPalette } from './components/ui/CommandPalette';
import { PrototypeDevToolbar } from './dev/PrototypeDevToolbar';

const OliviaStage1aContent: React.FC = () => {
  const {
    bootstrap,
    isAuthenticated,
    setIsAuthenticated,
    role,
    setRole,
    navigateTo,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    asyncState,
    reloadCurrentViewData,
  } = useAppState();

  if (!bootstrap) {
    return null;
  }

  return (
    <>
      {isAuthenticated ? (
        <AppShell />
      ) : (
        <LoginView
          config={bootstrap.loginConfig}
          selectedRole={role}
          onSelectRole={setRole}
          onAuthenticate={(chosenRole) => {
            setRole(chosenRole);
            setIsAuthenticated(true);
          }}
          asyncState={asyncState}
          onRetry={reloadCurrentViewData}
        />
      )}

      {/* Global Spotlight Command Palette (Ctrl+K) */}
      <CommandPalette
        open={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        items={bootstrap.spotlightIndex}
        onSelectTarget={(hubId, segmentId) => navigateTo(hubId, segmentId)}
      />

      {/* Isolated Prototype-Only Dev State & Role Switcher */}
      <PrototypeDevToolbar />
    </>
  );
};

export default function App() {
  return (
    <AppStateProvider>
      <OliviaStage1aContent />
    </AppStateProvider>
  );
}
