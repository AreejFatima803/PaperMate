import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

export const ChapterOptionsModal = ({ visible, onClose, chapterData, onOpenPaperBuilder }) => {
  if (!visible || !chapterData) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>
            📖 Chapter {chapterData.chapterNum} Study Options
          </Text>
          <Text style={styles.modalSubtitle}>
            {chapterData.subject?.name}
          </Text>

          <View style={styles.optionsList}>
            <TouchableOpacity style={styles.optionBtn} onPress={onClose}>
              <Text style={styles.optionIcon}>📝</Text>
              <View>
                <Text style={styles.optionText}>Chapter Study Notes</Text>
                <Text style={styles.optionSub}>Read detailed notes & main points</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBtn} onPress={onClose}>
              <Text style={styles.optionIcon}>❓</Text>
              <View>
                <Text style={styles.optionText}>Short Questions & Answers</Text>
                <Text style={styles.optionSub}>Important PCTB Board Q&As</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBtn} onPress={onClose}>
              <Text style={styles.optionIcon}>🎯</Text>
              <View>
                <Text style={styles.optionText}>Solved MCQs Bank</Text>
                <Text style={styles.optionSub}>Practice past paper MCQs</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionBtn, styles.highlightBtn]}
              onPress={() => {
                onClose();
                onOpenPaperBuilder(chapterData);
              }}
            >
              <Text style={styles.optionIcon}>📑</Text>
              <View>
                <Text style={[styles.optionText, styles.highlightText]}>Generate Custom Test Paper</Text>
                <Text style={styles.optionSub}>Create customized chapter test paper</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    width: '92%',
    maxWidth: 500,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 24
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 4
  },
  modalSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 20
  },
  optionsList: {
    gap: 12,
    marginBottom: 20
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: theme.colors.borderLight
  },
  highlightBtn: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primaryBorder
  },
  optionIcon: {
    fontSize: 22
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary
  },
  highlightText: {
    color: theme.colors.primary
  },
  optionSub: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  closeBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#f1f5f9'
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary
  }
});
