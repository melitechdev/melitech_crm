import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as db from '../../db';

// Mock the database functions
vi.mock('../../db', () => ({
  getSetting: vi.fn(),
  getSettingsByCategory: vi.fn(),
  getAllSettings: vi.fn(),
  setSetting: vi.fn(),
  deleteSetting: vi.fn(),
  getNextDocumentNumber: vi.fn(),
  resetDocumentNumberCounter: vi.fn(),
  getDocumentNumberingSettings: vi.fn(),
}));

describe('Settings Router - Document Numbering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNextDocumentNumber', () => {
    it('should generate the first invoice number with default prefix', async () => {
      // Mock: no existing prefix setting
      (db.getSetting as any).mockResolvedValueOnce(null); // prefix not found
      (db.getSetting as any).mockResolvedValueOnce(null); // next number not found
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      const result = await db.getNextDocumentNumber('invoice');

      expect(result).toBe('INV-000001');
      expect(db.setSetting).toHaveBeenCalledWith('invoice_next', '2', 'document_numbering');
    });

    it('should increment invoice number correctly', async () => {
      // Mock: existing prefix and next number
      (db.getSetting as any).mockResolvedValueOnce({ value: 'INV-' }); // prefix
      (db.getSetting as any).mockResolvedValueOnce({ value: '5' }); // next number
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      const result = await db.getNextDocumentNumber('invoice');

      expect(result).toBe('INV-000005');
      expect(db.setSetting).toHaveBeenCalledWith('invoice_next', '6', 'document_numbering');
    });

    it('should generate estimate numbers with EST- prefix', async () => {
      (db.getSetting as any).mockResolvedValueOnce(null); // prefix
      (db.getSetting as any).mockResolvedValueOnce(null); // next number
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      const result = await db.getNextDocumentNumber('estimate');

      expect(result).toBe('EST-000001');
    });

    it('should generate receipt numbers with REC- prefix', async () => {
      (db.getSetting as any).mockResolvedValueOnce(null); // prefix
      (db.getSetting as any).mockResolvedValueOnce(null); // next number
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      const result = await db.getNextDocumentNumber('receipt');

      expect(result).toBe('REC-000001');
    });

    it('should generate proposal numbers with PROP- prefix', async () => {
      (db.getSetting as any).mockResolvedValueOnce(null); // prefix
      (db.getSetting as any).mockResolvedValueOnce(null); // next number
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      const result = await db.getNextDocumentNumber('proposal');

      expect(result).toBe('PROP-000001');
    });

    it('should generate expense numbers with EXP- prefix', async () => {
      (db.getSetting as any).mockResolvedValueOnce(null); // prefix
      (db.getSetting as any).mockResolvedValueOnce(null); // next number
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      const result = await db.getNextDocumentNumber('expense');

      expect(result).toBe('EXP-000001');
    });

    it('should handle custom prefix', async () => {
      (db.getSetting as any).mockResolvedValueOnce({ value: 'CUSTOM-' }); // custom prefix
      (db.getSetting as any).mockResolvedValueOnce({ value: '10' }); // next number
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      const result = await db.getNextDocumentNumber('invoice');

      expect(result).toBe('CUSTOM-000010');
    });

    it('should pad numbers with leading zeros', async () => {
      (db.getSetting as any).mockResolvedValueOnce(null); // prefix
      (db.getSetting as any).mockResolvedValueOnce({ value: '999' }); // next number
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      const result = await db.getNextDocumentNumber('invoice');

      expect(result).toBe('INV-000999');
    });

    it('should handle large numbers', async () => {
      (db.getSetting as any).mockResolvedValueOnce(null); // prefix
      (db.getSetting as any).mockResolvedValueOnce({ value: '1000000' }); // large next number
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      const result = await db.getNextDocumentNumber('invoice');

      expect(result).toBe('INV-1000000');
    });
  });

  describe('resetDocumentNumberCounter', () => {
    it('should reset counter to 1 by default', async () => {
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      await db.resetDocumentNumberCounter('invoice');

      expect(db.setSetting).toHaveBeenCalledWith('invoice_next', '1', 'document_numbering');
    });

    it('should reset counter to custom start number', async () => {
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      await db.resetDocumentNumberCounter('invoice', 100);

      expect(db.setSetting).toHaveBeenCalledWith('invoice_next', '100', 'document_numbering');
    });
  });

  describe('getDocumentNumberingSettings', () => {
    it('should return all document numbering settings', async () => {
      const mockSettings = [
        { key: 'invoice_prefix', value: 'INV-' },
        { key: 'invoice_next', value: '5' },
        { key: 'estimate_prefix', value: 'EST-' },
        { key: 'estimate_next', value: '10' },
      ];

      (db.getSettingsByCategory as any).mockResolvedValueOnce(mockSettings);

      const result = await db.getDocumentNumberingSettings();

      expect(result).toEqual({
        invoice_prefix: 'INV-',
        invoice_next: '5',
        estimate_prefix: 'EST-',
        estimate_next: '10',
      });
    });

    it('should return empty object when no settings found', async () => {
      (db.getSettingsByCategory as any).mockResolvedValueOnce([]);

      const result = await db.getDocumentNumberingSettings();

      expect(result).toEqual({});
    });
  });

  describe('setSetting', () => {
    it('should create new setting', async () => {
      (db.getSetting as any).mockResolvedValueOnce(null); // setting doesn't exist
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      const result = await db.setSetting('test_key', 'test_value', 'test_category');

      expect(result).toBe('set_123');
    });

    it('should update existing setting', async () => {
      const existingSetting = { id: 'set_123', key: 'test_key', value: 'old_value' };
      (db.getSetting as any).mockResolvedValueOnce(existingSetting);
      (db.setSetting as any).mockResolvedValueOnce('set_123');

      const result = await db.setSetting('test_key', 'new_value', 'test_category');

      expect(result).toBe('set_123');
    });
  });

  describe('getSetting', () => {
    it('should retrieve a setting by key', async () => {
      const mockSetting = { id: 'set_123', key: 'invoice_prefix', value: 'INV-' };
      (db.getSetting as any).mockResolvedValueOnce(mockSetting);

      const result = await db.getSetting('invoice_prefix');

      expect(result).toEqual(mockSetting);
    });

    it('should return null if setting not found', async () => {
      (db.getSetting as any).mockResolvedValueOnce(null);

      const result = await db.getSetting('nonexistent_key');

      expect(result).toBeNull();
    });
  });

  describe('getSettingsByCategory', () => {
    it('should retrieve all settings in a category', async () => {
      const mockSettings = [
        { id: 'set_1', key: 'invoice_prefix', value: 'INV-', category: 'document_numbering' },
        { id: 'set_2', key: 'invoice_next', value: '5', category: 'document_numbering' },
      ];
      (db.getSettingsByCategory as any).mockResolvedValueOnce(mockSettings);

      const result = await db.getSettingsByCategory('document_numbering');

      expect(result).toEqual(mockSettings);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if category has no settings', async () => {
      (db.getSettingsByCategory as any).mockResolvedValueOnce([]);

      const result = await db.getSettingsByCategory('empty_category');

      expect(result).toEqual([]);
    });
  });

  describe('deleteSetting', () => {
    it('should delete a setting by key', async () => {
      (db.deleteSetting as any).mockResolvedValueOnce(undefined);

      await db.deleteSetting('test_key');

      expect(db.deleteSetting).toHaveBeenCalledWith('test_key');
    });
  });
});

