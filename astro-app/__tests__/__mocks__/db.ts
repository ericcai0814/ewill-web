/**
 * Database Mock
 *
 * Mock Drizzle ORM 的 db 物件，用於單元和整合測試
 */
import { vi } from 'vitest';

// 建立可鏈式呼叫的 mock query builder
function createQueryBuilder() {
  const builder: any = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
    groupBy: vi.fn().mockReturnThis(),
    having: vi.fn().mockReturnThis(),
    // 最終執行方法
    execute: vi.fn().mockResolvedValue([]),
    then: vi.fn((resolve) => resolve([])),
  };

  // 讓 builder 可以作為 Promise 使用
  builder[Symbol.toStringTag] = 'Promise';

  return builder;
}

// 建立 insert builder
function createInsertBuilder() {
  const builder: any = {
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    onConflictDoNothing: vi.fn().mockReturnThis(),
    onConflictDoUpdate: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([{ id: 1 }]),
    then: vi.fn((resolve) => resolve([{ id: 1 }])),
  };

  builder[Symbol.toStringTag] = 'Promise';

  return builder;
}

// 建立 update builder
function createUpdateBuilder() {
  const builder: any = {
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([{ id: 1 }]),
    then: vi.fn((resolve) => resolve([{ id: 1 }])),
  };

  builder[Symbol.toStringTag] = 'Promise';

  return builder;
}

// 建立 delete builder
function createDeleteBuilder() {
  const builder: any = {
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
    then: vi.fn((resolve) => resolve([])),
  };

  builder[Symbol.toStringTag] = 'Promise';

  return builder;
}

// Mock db 物件
export const mockDb = {
  select: vi.fn(() => createQueryBuilder()),
  insert: vi.fn(() => createInsertBuilder()),
  update: vi.fn(() => createUpdateBuilder()),
  delete: vi.fn(() => createDeleteBuilder()),
  query: {},
  $with: vi.fn(),
  with: vi.fn(),
};

// 重設所有 mock
export function resetDbMocks() {
  vi.clearAllMocks();
}

// 設定 select 回傳值的 helper
export function mockSelectReturn(data: any[]) {
  const builder = createQueryBuilder();
  builder.then = vi.fn((resolve) => resolve(data));
  mockDb.select.mockReturnValue(builder);
  return builder;
}

// 設定 insert 回傳值的 helper
export function mockInsertReturn(data: any[]) {
  const builder = createInsertBuilder();
  builder.then = vi.fn((resolve) => resolve(data));
  mockDb.insert.mockReturnValue(builder);
  return builder;
}

export default mockDb;
