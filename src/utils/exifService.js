const exifParser = require('exif-parser');

function extractTimeExif(fileBuffer) {
    try {
      const parser = exifParser.create(fileBuffer);
      const result = parser.parse();
      const { DateTimeOriginal, CreateDate, ModifyDate } = result.tags;
      return { DateTimeOriginal, CreateDate, ModifyDate };
    } catch (error) {
      console.error("EXIF 시간 정보 추출 오류:", error);
      return null;
    }
  }

module.exports = { extractTimeExif };