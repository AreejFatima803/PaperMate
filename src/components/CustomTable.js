import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../styles/theme';

export const CustomTable = ({ headers, data, onRowPress }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.tableContainer}>
        {/* Table Header Row */}
        <View style={styles.headerRow}>
          {headers.map((header, idx) => (
            <View key={idx} style={[styles.headerCell, { flex: header.flex || 1, alignItems: header.alignRight ? 'flex-end' : 'flex-start' }]}>
              <Text style={styles.headerText}>{header.title}</Text>
            </View>
          ))}
        </View>

        {/* Table Body Rows */}
        {data.map((row, rowIdx) => (
          <TouchableOpacity
            key={rowIdx}
            style={[styles.bodyRow, rowIdx === data.length - 1 && styles.lastRow]}
            activeOpacity={0.7}
            onPress={() => onRowPress && onRowPress(row)}
          >
            {row.cells.map((cell, cellIdx) => (
              <View key={cellIdx} style={[styles.bodyCell, { flex: headers[cellIdx]?.flex || 1, alignItems: headers[cellIdx]?.alignRight ? 'flex-end' : 'flex-start' }]}>
                {cell}
              </View>
            ))}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10
  },
  tableContainer: {
    backgroundColor: theme.colors.tableBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 750,
    width: '92%',
    maxWidth: 980,
    alignSelf: 'center',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tableHeaderBg,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
    paddingVertical: 14,
    paddingHorizontal: 24
  },
  headerCell: {
    paddingHorizontal: 8
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  bodyRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tableBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center'
  },
  lastRow: {
    borderBottomWidth: 0
  },
  bodyCell: {
    paddingHorizontal: 8
  }
});
