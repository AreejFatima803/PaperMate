import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { theme } from '../styles/theme';
import { Header } from '../components/Header';
import { PaperHistoryService } from '../services/storageService';

export const HistoryScreen = ({ onSelectSavedPaper, onBack, onNewPaper }) => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const list = await PaperHistoryService.getHistory();
      setHistoryList(list || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = (id) => {
    Alert.alert('پیپر ڈیلیٹ کریں (Delete)', 'کیا آپ واقعی اس پیپر کو ہسٹری سے حذف کرنا چاہتے ہیں؟', [
      { text: 'منسوخ (Cancel)', style: 'cancel' },
      {
        text: 'حذف کریں (Delete)',
        style: 'destructive',
        onPress: async () => {
          await PaperHistoryService.deletePaper(id);
          loadHistory();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header
        title="محفوظ شدہ پرچہ جات"
        subtitle="Saved Papers History"
        onBack={onBack}
        rightLabel="+ نیا پیپر"
        rightAction={onNewPaper}
      />

      <View style={styles.content}>
        {historyList.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconBox}>
              <Text style={styles.emptyIcon}>📁</Text>
            </View>
            <Text style={styles.emptyTitle}>کوئی پرچہ محفوظ نہیں ہے</Text>
            <Text style={styles.emptyDesc}>
              جب آپ کوئی نیا پیپر تیار کر کے محفوظ کریں گے، تو وہ یہاں ظاہر ہو جائے گا۔
            </Text>
            <TouchableOpacity style={styles.createBtn} onPress={onNewPaper}>
              <Text style={styles.createBtnText}>+ نیا پیپر بنائیں (Create Paper)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={historyList}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.historyCard}>
                <TouchableOpacity
                  style={styles.cardMain}
                  activeOpacity={0.7}
                  onPress={() => onSelectSavedPaper(item)}
                >
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.subjectText}>{item.subjectName}</Text>
                    <View style={styles.marksBadge}>
                      <Text style={styles.marksText}>{item.totalMarks} Marks</Text>
                    </View>
                  </View>

                  <Text style={styles.schoolText}>{item.institutionName}</Text>
                  <Text style={styles.metaText}>
                    🏛️ {item.boardName} • 🎓 {item.className} • 🌐 {item.medium}
                  </Text>
                  <Text style={styles.dateText}>📅 تاریخ: {item.createdAt || 'Recent'}</Text>
                </TouchableOpacity>

                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => onSelectSavedPaper(item)}
                  >
                    <Text style={styles.actionViewText}>👁️ دیکھیں (View / Print)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtnDelete}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.actionDeleteText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
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
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  emptyDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  createBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  cardMain: {
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subjectText: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  marksBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  marksText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  schoolText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
  },
  cardActionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  actionViewText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  actionBtnDelete: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDeleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.danger,
  },
});
