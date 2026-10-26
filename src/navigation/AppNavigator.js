import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, BackHandler, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';
import { SignUpScreen } from '../screens/Auth/SignUpScreen';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { BoardSelectScreen } from '../screens/BoardSelectScreen';
import { ClassSelectScreen } from '../screens/ClassSelectScreen';
import { SubjectSelectScreen } from '../screens/SubjectSelectScreen';
import { SyllabusSelectScreen } from '../screens/SyllabusSelectScreen';
import { PaperPatternScreen } from '../screens/PaperPatternScreen';
import { GeneratedPaperScreen } from '../screens/GeneratedPaperScreen';
import { EditPaperScreen } from '../screens/EditPaperScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { generateExamPaper } from '../services/paperGenerator';
import { AuthService } from '../services/storageService';

export const AppNavigator = () => {
  // Screens: 'SIGNUP' | 'LOGIN' | 'BOARD' | 'CLASS' | 'MEDIUM' | 'SUBJECT' | 'SYLLABUS' | 'PATTERN' | 'GENERATED' | 'EDIT' | 'HISTORY'
  const [currentScreen, setCurrentScreen] = useState('BOARD');
  const [isRestoringAuth, setIsRestoringAuth] = useState(true);

  // Auth state
  const [user, setUser] = useState(null);
  const [loginPrefill, setLoginPrefill] = useState({ email: '', password: '' });

  // Creation Flow State
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedMedium, setSelectedMedium] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [syllabusConfig, setSyllabusConfig] = useState(null);
  const [currentPaper, setCurrentPaper] = useState(null);

  // Return to previous screen from History
  const [previousScreenBeforeHistory, setPreviousScreenBeforeHistory] = useState('BOARD');

  // Check saved authentication session on launch
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const savedUser = await AuthService.getCurrentUser();
        if (isMounted) {
          if (savedUser) {
            setUser(savedUser);
            setCurrentScreen('BOARD');
          } else {
            const hasUsers = await AuthService.hasAnyUser();
            setCurrentScreen(hasUsers ? 'LOGIN' : 'SIGNUP');
          }
        }
      } catch (err) {
        if (isMounted) setCurrentScreen('LOGIN');
      } finally {
        if (isMounted) setIsRestoringAuth(false);
      }
    };
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  // Navigation handlers
  const handleSignUpSuccess = (data) => {
    if (data?.user) {
      setUser(data.user);
      setCurrentScreen('BOARD');
      return;
    }
    if (data?.email) {
      setLoginPrefill({ email: data.email, password: data.prefilledPassword || '' });
    }
    setCurrentScreen('LOGIN');
  };

  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setCurrentScreen('BOARD');
  };

  const handleSelectBoard = (board) => {
    setSelectedBoard(board);
    setCurrentScreen('CLASS');
  };

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    setCurrentScreen('SUBJECT');
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setCurrentScreen('SYLLABUS');
  };

  const handleProceedToPattern = (config) => {
    setSyllabusConfig(config);
    setCurrentScreen('PATTERN');
  };

  const handleGeneratePaper = (config) => {
    const generated = generateExamPaper(config);
    setCurrentPaper(generated);
    setCurrentScreen('GENERATED');
  };

  const handleEditPaper = (paperToEdit) => {
    setCurrentPaper(paperToEdit);
    setCurrentScreen('EDIT');
  };

  const handleSaveEditedPaper = (updatedPaper) => {
    setCurrentPaper(updatedPaper);
    setCurrentScreen('GENERATED');
  };

  const handleOpenHistory = () => {
    setPreviousScreenBeforeHistory(currentScreen);
    setCurrentScreen('HISTORY');
  };

  const handleSelectSavedPaper = (savedPaper) => {
    setCurrentPaper(savedPaper);
    setCurrentScreen('GENERATED');
  };

  const handleStartNewPaper = () => {
    setCurrentScreen('BOARD');
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (e) {}
    setUser(null);
    setCurrentScreen('LOGIN');
  };

  if (isRestoringAuth) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.contentWrap}>
        {currentScreen === 'SIGNUP' && (
          <SignUpScreen onNavigateToLogin={handleSignUpSuccess} />
        )}

        {currentScreen === 'LOGIN' && (
          <LoginScreen
            initialEmail={loginPrefill.email}
            initialPassword={loginPrefill.password}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignUp={() => setCurrentScreen('SIGNUP')}
          />
        )}

        {currentScreen === 'BOARD' && (
          <BoardSelectScreen
            user={user}
            onSelectBoard={handleSelectBoard}
            onOpenHistory={handleOpenHistory}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'CLASS' && (
          <ClassSelectScreen
            selectedBoard={selectedBoard}
            onSelectClass={handleSelectClass}
            onBack={() => setCurrentScreen('BOARD')}
          />
        )}

        {currentScreen === 'SUBJECT' && (
          <SubjectSelectScreen
            selectedBoard={selectedBoard}
            selectedClass={selectedClass}
            selectedMedium={selectedMedium}
            onSelectSubject={handleSelectSubject}
            onBack={() => setCurrentScreen('CLASS')}
          />
        )}

        {currentScreen === 'SYLLABUS' && (
          <SyllabusSelectScreen
            selectedBoard={selectedBoard}
            selectedClass={selectedClass}
            selectedMedium={selectedMedium}
            selectedSubject={selectedSubject}
            onProceedToPattern={handleProceedToPattern}
            onBack={() => setCurrentScreen('SUBJECT')}
          />
        )}

        {currentScreen === 'PATTERN' && (
          <PaperPatternScreen
            selectedBoard={selectedBoard}
            selectedClass={selectedClass}
            selectedMedium={selectedMedium}
            selectedSubject={selectedSubject}
            syllabusConfig={syllabusConfig}
            onGeneratePaper={handleGeneratePaper}
            onBack={() => setCurrentScreen('SYLLABUS')}
          />
        )}

        {currentScreen === 'GENERATED' && currentPaper && (
          <GeneratedPaperScreen
            paper={currentPaper}
            onEditPaper={handleEditPaper}
            onNavigateHome={handleStartNewPaper}
            onBack={() => setCurrentScreen('PATTERN')}
          />
        )}

        {currentScreen === 'EDIT' && currentPaper && (
          <EditPaperScreen
            paper={currentPaper}
            onSaveEditedPaper={handleSaveEditedPaper}
            onBack={() => setCurrentScreen('GENERATED')}
          />
        )}

        {currentScreen === 'HISTORY' && (
          <HistoryScreen
            onSelectSavedPaper={handleSelectSavedPaper}
            onBack={() => setCurrentScreen(previousScreenBeforeHistory)}
            onNewPaper={handleStartNewPaper}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentWrap: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
