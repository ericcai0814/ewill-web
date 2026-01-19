/**
 * File System Mock
 *
 * Mock fs/promises 模組，用於測試檔案讀取功能
 */
import { vi } from 'vitest';

// 模擬檔案系統內容
const mockFileSystem: Map<string, string> = new Map();

// Mock readFile
export const mockReadFile = vi.fn<[string, string?], Promise<string>>().mockImplementation(
  async (filePath: string) => {
    const content = mockFileSystem.get(filePath);
    if (content === undefined) {
      const error = new Error(`ENOENT: no such file or directory, open '${filePath}'`) as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      throw error;
    }
    return content;
  }
);

// Mock writeFile
export const mockWriteFile = vi.fn<[string, string], Promise<void>>().mockImplementation(
  async (filePath: string, content: string) => {
    mockFileSystem.set(filePath, content);
  }
);

// Mock access
export const mockAccess = vi.fn<[string], Promise<void>>().mockImplementation(
  async (filePath: string) => {
    if (!mockFileSystem.has(filePath)) {
      const error = new Error(`ENOENT: no such file or directory, access '${filePath}'`) as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      throw error;
    }
  }
);

// Mock readdir
export const mockReaddir = vi.fn<[string], Promise<string[]>>().mockResolvedValue([]);

// Mock stat
export const mockStat = vi.fn().mockResolvedValue({
  isFile: () => true,
  isDirectory: () => false,
  size: 1024,
  mtime: new Date(),
});

// Mock mkdir
export const mockMkdir = vi.fn<[string, { recursive?: boolean }?], Promise<string | undefined>>().mockResolvedValue(undefined);

// Mock unlink
export const mockUnlink = vi.fn<[string], Promise<void>>().mockResolvedValue();

// Helper: 設定模擬檔案
export function setMockFile(filePath: string, content: string) {
  mockFileSystem.set(filePath, content);
}

// Helper: 設定多個模擬檔案
export function setMockFiles(files: Record<string, string>) {
  for (const [filePath, content] of Object.entries(files)) {
    mockFileSystem.set(filePath, content);
  }
}

// Helper: 清除模擬檔案系統
export function clearMockFileSystem() {
  mockFileSystem.clear();
}

// Helper: 重設所有 mock
export function resetFsMocks() {
  mockReadFile.mockClear();
  mockWriteFile.mockClear();
  mockAccess.mockClear();
  mockReaddir.mockClear();
  mockStat.mockClear();
  mockMkdir.mockClear();
  mockUnlink.mockClear();
  clearMockFileSystem();
}

// 匯出 mock 模組（模擬 fs/promises）
export default {
  readFile: mockReadFile,
  writeFile: mockWriteFile,
  access: mockAccess,
  readdir: mockReaddir,
  stat: mockStat,
  mkdir: mockMkdir,
  unlink: mockUnlink,
};
