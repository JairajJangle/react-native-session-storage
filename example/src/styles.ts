import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: COLORS.primary,
    minHeight: '100%',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    paddingTop: 10,
    paddingBottom: 15,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
  },
  inputValue: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.coral,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  output: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    width: '100%',
    minHeight: 50,
  },
  success: {
    backgroundColor: COLORS.green,
    color: COLORS.white,
  },
  error: {
    backgroundColor: COLORS.red,
    color: COLORS.white,
  },
  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: '100%',
  },
  itemKey: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  itemValue: {
    fontSize: 14,
    color: COLORS.mediumGray,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.lightGray,
    textAlign: 'center',
    padding: 20,
  },
});

export default styles;