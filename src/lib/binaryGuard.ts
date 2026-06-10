// Pure function — no React, no side effects, fully testable.
// Returns true if the file extension is known binary.

export const BINARY_EXTS = new Set([
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp',
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'bmp', 'tiff', 'heic', 'heif',
  'mp3', 'mp4', 'wav', 'flac', 'aac', 'ogg', 'mov', 'avi', 'mkv', 'webm',
  'zip', 'tar', 'gz', 'rar', '7z', 'bz2', 'xz',
  'exe', 'dll', 'so', 'dylib', 'bin', 'dmg', 'iso', 'apk',
  'db', 'sqlite', 'sqlite3', 'mdb',
  'ttf', 'otf', 'woff', 'woff2', 'eot',
  'pyc', 'class', 'o', 'a', 'lib',
])

export function isBinary(ext: string): boolean {
  return BINARY_EXTS.has(ext.toLowerCase())
}
