import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
import { CLASSES } from '../data/boardsAndCurriculum';

export const ClassSelectScreen = ({ selectedBoard, onSelectClass, onBack }) => {
  const part1Classes = CLASSES.filter((c) => c.id === '9' || c.id === '10');
  const part2Classes = CLASSES.filter((c) => c.id === '11' || c.id === '12');

  const getCustomSubtitle = (cls) => {
    switch (cls.id) {
      case '9':
        return 'Matric Part-I • Science, Arts, Computer';
      case '10':
        return 'Matric Part-II • Board Exam Pattern';
      case '11':
        return '1st Year • FSc, ICS, FA, I.Com Groups';
      case '12':
        return '2nd Year • Board Final Examination';
      default:
        return cls.subtitle || 'Curriculum 2026';
    }
  };

  const renderClassItem = (cls) => {
    const subtitleText = getCustomSubtitle(cls);

    return (
      <TouchableOpacity
        key={cls.id}
        style={styles.classCard}
        activeOpacity={0.72}
        onPress={() => onSelectClass(cls)}
      >
        {/* Left Badge */}
        <View style={styles.classBadge}>
          <Text style={styles.classBadgeNum}>{cls.id}</Text>
          <Text style={styles.classBadgeSuffix}>th</Text>
        </View>

        {/* Center Details */}
        <View style={styles.classInfoCol}>
          <View style={styles.classTitleRow}>
            <Text style={styles.classTitleText} numberOfLines={1}>
              {cls.id === '11' ? '11th Class (1st Year)' : cls.id === '12' ? '12th Class (2nd Year)' : cls.name}
            </Text>
            <View style={styles.yearChip}>
              <Text style={styles.yearChipText}>2026</Text>
            </View>
          </View>

          <Text style={styles.classSubtitleText} numberOfLines={1}>
            {subtitleText}
          </Text>
        </View>

        {/* Right Arrow Chevron */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrowIcon}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Select Class"
        subtitle="Matric & Intermediate (FSc)"
        onBack={onBack}
      />

      <View style={styles.content}>
        {/* Compact Selected Board Chip */}
        <View style={styles.boardBanner}>
          <Text style={styles.boardIcon}>🏛️</Text>
          <Text style={styles.boardBannerTitle} numberOfLines={1}>
            Board: {selectedBoard?.name || 'Standard Board Curriculum'}
          </Text>
          <View style={styles.boardYearBadge}>
            <Text style={styles.boardYearText}>Session 2026</Text>
          </View>
        </View>

        {/* ======================================================== */}
        {/* SECTION 1: MATRICULATION (SSC - 9TH & 10TH) - DARK BOX    */}
        {/* ======================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionIconWrap}>
                <Text style={styles.sectionEmoji}>📚</Text>
              </View>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.sectionMainTitle}>Matriculation (SSC)</Text>
                <Text style={styles.sectionSub}>9th & 10th Class • Punjab & Federal</Text>
              </View>
            </View>
            <View style={styles.sectionPill}>
              <Text style={styles.sectionPillText}>SSC</Text>
            </View>
          </View>

          <View style={styles.classList}>
            {part1Classes.map((cls) => renderClassItem(cls))}
          </View>
        </View>

        {/* ======================================================== */}
        {/* SECTION 2: INTERMEDIATE / FSC (11TH & 12TH) - SAME THEME */}
        {/* ======================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionIconWrap}>
                <Text style={styles.sectionEmoji}>🎓</Text>
              </View>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.sectionMainTitle}>Intermediate (HSSC / FSc)</Text>
                <Text style={styles.sectionSub}>1st & 2nd Year • FSc, ICS, FA, I.Com</Text>
              </View>
            </View>
            <View style={styles.sectionPill}>
              <Text style={styles.sectionPillText}>HSSC</Text>
            </View>
          </View>

          <View style={styles.classList}>
            {part2Classes.map((cls) => renderClassItem(cls))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    justifyContent: 'flex-start',
    gap: 10,
  },

  // Compact Board Banner
  boardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  boardIcon: {
    fontSize: 15,
    marginRight: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  boardBannerTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  boardYearBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  boardYearText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1D4ED8',
  },

  // Main Section Cards (Dark Boxes - Increased height by 20px)
  sectionCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },

  // Unified Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#1E3A8A',
    borderWidth: 1,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  sectionEmoji: {
    fontSize: 15,
  },
  sectionTitleBlock: {
    flex: 1,
  },
  sectionMainTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionSub: {
    fontSize: 10.5,
    color: '#93C5FD',
    fontWeight: '500',
    marginTop: 1,
  },
  sectionPill: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 7.5,
    paddingVertical: 2,
    borderRadius: 5,
    marginLeft: 6,
  },
  sectionPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Class List inside Dark Boxes (+20px overall height)
  classList: {
    padding: 12,
    gap: 10,
  },

  // Individual Class Cards (+20px height)
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 65,
  },
  classBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  classBadgeNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1D4ED8',
    includeFontPadding: false,
  },
  classBadgeSuffix: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#2563EB',
    marginTop: -5,
    marginLeft: 1,
    includeFontPadding: false,
  },
  classInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  classTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  classTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  yearChip: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    backgroundColor: '#DCFCE7',
  },
  yearChipText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#15803D',
  },
  classSubtitleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  arrowContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D4ED8',
    marginTop: -2,
  },
});
