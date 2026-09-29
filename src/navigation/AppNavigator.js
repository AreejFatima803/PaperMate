import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import { Header } from '../components/Header';
import { SplashScreen } from '../components/SplashScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ClassDetailScreen } from '../screens/ClassDetailScreen';
import { SubjectPortalScreen } from '../screens/SubjectPortalScreen';
import { ChapterPortionScreen } from '../screens/ChapterPortionScreen';
import { PaperBuilderScreen } from '../screens/PaperBuilderScreen';

export const AppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('splash'); // splash | dashboard | classDetail | subjectPortal | chapterPortion | paperBuilder
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapterData, setSelectedChapterData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (currentScreen === 'splash') {
    return <SplashScreen onEnter={() => setCurrentScreen('dashboard')} />;
  }

  const handleSelectClass = (classKey) => {
    setSelectedClass(classKey);
    setCurrentScreen('classDetail');
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setCurrentScreen('subjectPortal');
  };

  const handleSelectChapter = (chapterObj) => {
    setSelectedChapterData(chapterObj);
    setCurrentScreen('chapterPortion');
  };

  const handleSelectPortion = (portionKey, portionName) => {
    setSelectedChapterData(prev => ({
      ...prev,
      portionKey,
      portionName
    }));
    setCurrentScreen('paperBuilder');
  };

  const handleOpenPaperBuilder = (chapterData) => {
    setSelectedChapterData(chapterData);
    setCurrentScreen('paperBuilder');
  };

  const handleGoDashboard = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setCurrentScreen('dashboard');
  };

  const handleGoClassDetail = () => {
    setSelectedSubject(null);
    setCurrentScreen('classDetail');
  };

  const handleGoSubjectPortal = () => {
    setCurrentScreen('subjectPortal');
  };

  const handleGoChapterPortion = () => {
    setCurrentScreen('chapterPortion');
  };

  return (
    <View style={styles.container}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogoPress={handleGoDashboard}
      />

      <View style={styles.body}>
        {currentScreen === 'dashboard' && (
          <DashboardScreen onSelectClass={handleSelectClass} />
        )}

        {currentScreen === 'classDetail' && (
          <ClassDetailScreen
            className={selectedClass}
            onBack={handleGoDashboard}
            onSelectSubject={handleSelectSubject}
          />
        )}

        {currentScreen === 'subjectPortal' && (
          <SubjectPortalScreen
            subject={selectedSubject}
            className={selectedClass}
            onBack={handleGoClassDetail}
            onSelectChapter={handleSelectChapter}
            onOpenPaperBuilder={handleOpenPaperBuilder}
          />
        )}

        {currentScreen === 'chapterPortion' && (
          <ChapterPortionScreen
            chapterData={selectedChapterData}
            onBack={handleGoSubjectPortal}
            onSelectPortion={handleSelectPortion}
          />
        )}

        {currentScreen === 'paperBuilder' && (
          <PaperBuilderScreen
            chapterData={selectedChapterData}
            onBack={handleGoChapterPortion}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: theme.colors.background
  },
  body: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
});
