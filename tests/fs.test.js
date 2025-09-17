import 'fake-indexeddb/auto';
import { describe, it, beforeEach, expect } from 'vitest';

import {
  initFileSystem,
  listDir,
  writeFile,
  readFile,
  moveFile,
  deleteFile,
  restoreDefaults,
  stat,
  DesktopDir,
} from '../src/fs.js';

const delay = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('filesystem api', () => {
  beforeEach(async () => {
    await initFileSystem();
    await restoreDefaults();
    // restoreDefaults repopulates asynchronously, wait a tick for change events to flush
    await delay();
  });

  it('seeds default desktop entries', async () => {
    const { entries } = await listDir(DesktopDir);
    const names = entries.map((entry) => entry.name);
    expect(names).toContain('Read Me.txt');
    expect(names).toContain('Resume.link');
  });

  it('writes and reads files', async () => {
    await writeFile('/Documents/Test.txt', 'hello world', { meta: { openWith: 'notes' } });
    const content = await readFile('/Documents/Test.txt');
    expect(content).toBe('hello world');
  });

  it('moves files and resolves name conflicts', async () => {
    await writeFile('/Documents/Note.txt', 'first');
    const first = await moveFile('/Documents/Note.txt', DesktopDir);
    expect(first.path).toBe(`${DesktopDir}/Note.txt`);

    await writeFile('/Documents/Note.txt', 'second');
    const second = await moveFile('/Documents/Note.txt', DesktopDir);
    expect(second.path).not.toBe(first.path);
    expect(second.path.startsWith(`${DesktopDir}/Note`)).toBe(true);
  });

  it('deletes folders recursively', async () => {
    await writeFile('/Documents/Temp', { type: 'folder' });
    await writeFile('/Documents/Temp/a.txt', 'data');
    await deleteFile('/Documents/Temp');
    const folder = await stat('/Documents/Temp');
    expect(folder).toBeNull();
  });

  it('restores defaults', async () => {
    await writeFile('/Desktop/Read Me.txt', 'edited');
    await restoreDefaults();
    await delay();
    const text = await readFile('/Desktop/Read Me.txt');
    expect(text).toMatch(/Double-click to open/);
  });
});
