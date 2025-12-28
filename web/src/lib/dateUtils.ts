/**
 * 日付文字列をDateオブジェクトに変換する
 * @param dateString 日付文字列 (YYYY-MM-DD)
 * @returns Dateオブジェクト | null
 */
export const parseEntryDate = (dateString: string): Date | null => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString)
    if (!match) return null
    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    return new Date(year, month - 1, day)
}

