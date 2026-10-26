import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { theme } from '../styles/theme';
import { Header } from '../components/Header';
import { BOARDS } from '../data/boardsAndCurriculum';

export const BoardSelectScreen = ({ user, onSelectBoard, onOpenHistory, onLogout }) => {
  const [search, setSearch] = useState('');

  const filteredBoards = BOARDS.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.province.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header
        title="Select Educational Board"
        subtitle="Choose Examination Board"
        rightLabel="📜 History"
        rightAction={onOpenHistory}
      />

      <View style={styles.content}>
        <View style={styles.welcomeBanner}>
          <View>
            <Text style={styles.welcomeTitle}>Welcome, {user?.name || 'Educator / Student'} 👋</Text>
            <Text style={styles.welcomeSubtitle}>Select which board pattern you want to generate paper for:</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Board (e.g. Lahore, Rawalpindi, Federal)..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={styles.listHeader}>Available Examination Boards (2026)</Text>

        <FlatList
          data={filteredBoards}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.boardCard}
              activeOpacity={0.7}
              onPress={() => onSelectBoard(item)}
            >
              <View style={styles.boardIconBox}>
                <Text style={styles.boardIcon}>🏛️</Text>
              </View>
              <View style={styles.boardInfo}>
                <Text style={styles.boardName}>{item.name}</Text>
                <Text style={styles.boardProvince}>{item.province} Education Department</Text>
              </View>
              <View style={styles.arrowBox}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeBanner: {
    backgroundColor: theme.colors.primaryLight,
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 14,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  clearIcon: {
    fontSize: 16,
    color: '#9CA3AF',
    paddingHorizontal: 6,
  },
  listHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  boardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  boardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  boardIcon: {
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 22,
  },
  boardInfo: {
    flex: 1,
  },
  boardName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  boardProvince: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 18,
  },
});
